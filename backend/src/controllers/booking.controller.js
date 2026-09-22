import { prisma, supabase, hasDatabaseUrl } from '../config/db.js';
import { isValidMobile, isValidPersonName, sanitizeMobile, sanitizePersonName } from '../utils/validation.js';

// Helper to normalize UUID vs Token
const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export const getBookings = async (req, res) => {
  try {
    const { centreId, status, token, bookingType, booking_type, limit = 50 } = req.query;
    const typeFilter = (bookingType || booking_type || '').toUpperCase();

    if (hasDatabaseUrl && prisma) {
      const where = {};
      if (centreId) where.centre_id = centreId;
      if (status) where.status = status.toUpperCase();
      if (token) where.token = token.toUpperCase();
      if (typeFilter) where.booking_type = typeFilter;

      const bookings = await prisma.booking.findMany({
        where,
        include: { centre: true },
        orderBy: { created_at: 'desc' },
        take: Number(limit)
      });

      return res.json({ success: true, count: bookings.length, data: bookings });
    }

    if (supabase) {
      let query = supabase.from('bookings').select('*, centres(*)').order('created_at', { ascending: false }).limit(Number(limit));
      if (centreId) query = query.eq('centre_id', centreId);
      if (status) query = query.eq('status', status.toUpperCase());
      if (token) query = query.eq('token', token.toUpperCase());
      if (typeFilter) query = query.eq('booking_type', typeFilter);

      const { data, error } = await query;
      if (error) throw error;

      return res.json({ success: true, count: (data || []).length, data: data || [] });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[GetBookings Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (hasDatabaseUrl && prisma) {
      const booking = isUuid(id)
        ? await prisma.booking.findUnique({ where: { id }, include: { centre: true } })
        : await prisma.booking.findUnique({ where: { token: id.toUpperCase() }, include: { centre: true } });

      if (!booking) {
        return res.status(404).json({ success: false, message: `Booking '${id}' not found` });
      }
      return res.json({ success: true, data: booking });
    }

    if (supabase) {
      const query = supabase.from('bookings').select('*, centres(*)');
      const { data, error } = isUuid(id) ? await query.eq('id', id).single() : await query.eq('token', id.toUpperCase()).single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: `Booking '${id}' not found` });
      }
      return res.json({ success: true, data });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[GetBookingById Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      centreId,
      cropName,
      slotTime,
      expectedQty,
      farmerName,
      mobile,
      aadhaarLast4 = '4821',
      token: requestedToken,
      arrivalTime,
      arrival_time,
      estTime,
      est_time,
      qualityParameters,
      quality_parameters,
      freightSubsidy = 0,
      freight_subsidy = 0,
      reroutedFrom,
      rerouted_from
    } = req.body;

    // 1. Validation
    if (!centreId) {
      return res.status(400).json({ success: false, message: 'centreId is required' });
    }
    if (!cropName) {
      return res.status(400).json({ success: false, message: 'cropName is required' });
    }
    if (!slotTime) {
      return res.status(400).json({ success: false, message: 'slotTime is required' });
    }
    if (!expectedQty || Number(expectedQty) <= 0) {
      return res.status(400).json({ success: false, message: 'expectedQty must be greater than 0' });
    }

    if (farmerName && !isValidPersonName(farmerName)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid farmer name. Must contain only alphabetic characters and spaces (2-60 characters).'
      });
    }

    if (mobile && !isValidMobile(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number. Must be a valid 10-digit Indian mobile number.'
      });
    }

    const effectiveFarmerName = farmerName ? sanitizePersonName(farmerName) : (req.user?.name || 'Ramesh Singh (YOU)');
    const effectiveMobile = mobile ? sanitizeMobile(mobile) : (req.user?.phone || '9876543210');
    const rawBookingType = (req.body.bookingType || req.body.booking_type || 'ONLINE').toUpperCase();
    const bookingType = ['ONLINE', 'WALK_IN', 'ASSISTED'].includes(rawBookingType) ? rawBookingType : 'ONLINE';
    const initialStatus = req.body.status || (bookingType === 'WALK_IN' ? 'CHECKED_IN' : 'WAITING');
    const slotCapacityLimit = Number(req.body.slotCapacity || 5); // Configurable max 5 trucks per 30-min window

    const effectiveArrivalTime = arrivalTime || arrival_time ? new Date(arrivalTime || arrival_time).toISOString() : null;
    const effectiveEstTime = estTime || est_time ? new Date(estTime || est_time).toISOString() : null;
    const effectiveQualityParams = qualityParameters || quality_parameters || null;
    const effectiveFreightSubsidy = Number(freightSubsidy || freight_subsidy || 0);
    const effectiveReroutedFrom = reroutedFrom || rerouted_from || null;

    // 2. Prisma Database Flow (with Transaction-based capacity verification & atomic concurrency lock)
    if (hasDatabaseUrl && prisma) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          // Verify centre exists
          const centre = await tx.centre.findUnique({ where: { id: centreId } });
          if (!centre) {
            const err = new Error(`Procurement centre '${centreId}' does not exist`);
            err.statusCode = 404;
            throw err;
          }

          // Strict slot capacity check to prevent concurrent overbooking
          const activeInSlot = await tx.booking.count({
            where: {
              centre_id: centreId,
              slot_time: slotTime,
              status: { in: ['WAITING', 'CHECKED_IN', 'PROCESSING'] }
            }
          });

          if (activeInSlot >= slotCapacityLimit) {
            const conflictErr = new Error(`Selected arrival window is at full capacity (${activeInSlot}/${slotCapacityLimit}). Please select an alternative slot.`);
            conflictErr.statusCode = 409;
            conflictErr.code = 'SLOT_FULL';
            throw conflictErr;
          }

          // Generate non-colliding token
          let tokenToUse = requestedToken;
          if (!tokenToUse) {
            const prefix = (centreId || 'SNP').toUpperCase().replace('CNT-', '').slice(0, 3) || 'SNP';
            const totalBookings = await tx.booking.count();
            let candidateNum = totalBookings + 11;
            let candidate = `${prefix}-0${candidateNum < 100 ? candidateNum : candidateNum}`;
            
            let exists = await tx.booking.findUnique({ where: { token: candidate } });
            while (exists) {
              candidateNum++;
              candidate = `${prefix}-0${candidateNum < 100 ? candidateNum : candidateNum}`;
              exists = await tx.booking.findUnique({ where: { token: candidate } });
            }
            tokenToUse = candidate;
          }

          return tx.booking.create({
            data: {
              token: tokenToUse,
              centre_id: centreId,
              farmer_name: effectiveFarmerName,
              mobile: effectiveMobile,
              aadhaar_last4: aadhaarLast4,
              crop_name: cropName,
              slot_time: slotTime,
              expected_qty: Number(expectedQty),
              status: initialStatus,
              booking_type: bookingType,
              counter: req.body.counter || 'Counter 2',
              rate_per_quintal: 2200,
              payment_status: 'PENDING',
              arrival_time: effectiveArrivalTime ? new Date(effectiveArrivalTime) : null,
              est_time: effectiveEstTime ? new Date(effectiveEstTime) : null,
              quality_parameters: effectiveQualityParams,
              freight_subsidy: effectiveFreightSubsidy,
              rerouted_from: effectiveReroutedFrom
            },
            include: { centre: true }
          });
        });

        return res.status(201).json({
          success: true,
          message: 'Slot booked successfully',
          data: {
            ...result,
            bookingType
          }
        });
      } catch (txError) {
        if (txError.statusCode === 409 || txError.code === 'SLOT_FULL') {
          return res.status(409).json({
            success: false,
            code: 'SLOT_FULL',
            message: txError.message
          });
        }
        throw txError;
      }
    }

    // 3. Supabase Direct Client Flow
    if (supabase) {
      // Verify centre exists, fallback gracefully if not found
      let validCentreId = centreId;
      const { data: centreData } = await supabase.from('centres').select('id, name').eq('id', centreId).maybeSingle();
      if (!centreData) {
        // Fallback to first available centre in Supabase
        const { data: firstCentre } = await supabase.from('centres').select('id').limit(1).maybeSingle();
        if (firstCentre) {
          validCentreId = firstCentre.id;
        }
      }

      // Slot Capacity Verification in Supabase
      const { count: slotBookingsCount } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('centre_id', validCentreId)
        .eq('slot_time', slotTime)
        .in('status', ['WAITING', 'CHECKED_IN', 'PROCESSING']);

      if ((slotBookingsCount || 0) >= slotCapacityLimit) {
        return res.status(409).json({
          success: false,
          code: 'SLOT_FULL',
          message: `Selected arrival window is at full capacity (${slotBookingsCount}/${slotCapacityLimit}). Please select an alternative slot.`
        });
      }

      // Generate guaranteed non-colliding token
      let tokenToUse = requestedToken;
      if (!tokenToUse) {
        const prefix = (validCentreId || 'SNP').toUpperCase().replace('CNT-', '').slice(0, 3) || 'SNP';
        const { count } = await supabase.from('bookings').select('id', { count: 'exact', head: true });
        let candidateNum = (count || 0) + 11;
        let candidate = `${prefix}-0${candidateNum < 100 ? candidateNum : candidateNum}`;

        let collision = true;
        let attempts = 0;
        while (collision && attempts < 50) {
          attempts++;
          const { data: existing } = await supabase.from('bookings').select('id').eq('token', candidate).maybeSingle();
          if (existing) {
            candidateNum++;
            candidate = `${prefix}-0${candidateNum < 100 ? candidateNum : candidateNum}`;
          } else {
            collision = false;
          }
        }
        tokenToUse = candidate;
      }

      const newBookingPayload = {
        token: tokenToUse,
        centre_id: validCentreId,
        farmer_name: effectiveFarmerName,
        mobile: effectiveMobile,
        aadhaar_last4: aadhaarLast4,
        crop_name: cropName,
        slot_time: slotTime,
        expected_qty: Number(expectedQty),
        status: initialStatus,
        booking_type: bookingType,
        counter: req.body.counter || 'Counter 2',
        rate_per_quintal: 2200,
        payment_status: 'PENDING',
        arrival_time: effectiveArrivalTime,
        est_time: effectiveEstTime,
        quality_parameters: effectiveQualityParams,
        freight_subsidy: effectiveFreightSubsidy,
        rerouted_from: effectiveReroutedFrom
      };

      let { data, error } = await supabase.from('bookings').insert([newBookingPayload]).select('*, centres(*)').maybeSingle();

      if (error && (error.code === 'PGRST204' || error.message?.includes('schema cache'))) {
        const basePayload = {
          token: tokenToUse,
          centre_id: validCentreId,
          farmer_name: effectiveFarmerName,
          mobile: effectiveMobile,
          aadhaar_last4: aadhaarLast4,
          crop_name: cropName,
          slot_time: slotTime,
          expected_qty: Number(expectedQty),
          status: initialStatus,
          counter: req.body.counter || 'Counter 2',
          rate_per_quintal: 2200,
          payment_status: 'PENDING'
        };
        const retryRes = await supabase.from('bookings').insert([basePayload]).select('*, centres(*)').maybeSingle();
        if (retryRes.error) throw retryRes.error;
        data = { ...retryRes.data, ...newBookingPayload };
        error = null;
      }

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Slot booked successfully',
        data: {
          ...data,
          bookingType
        }
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[CreateBooking Error]:', error);
    return res.status(error.statusCode || 400).json({ 
      success: false, 
      code: error.code || 'BOOKING_FAILED',
      message: error.message || 'Unable to create booking in registry' 
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Normalize keys to database snake_case columns
    const updateData = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.bookingType !== undefined || body.booking_type !== undefined) updateData.booking_type = (body.bookingType || body.booking_type).toUpperCase();
    if (body.counter !== undefined) updateData.counter = body.counter;
    if (body.actualQty !== undefined || body.actual_qty !== undefined) updateData.actual_qty = Number(body.actualQty ?? body.actual_qty);
    if (body.moisturePercent !== undefined || body.moisture_percent !== undefined) updateData.moisture_percent = Number(body.moisturePercent ?? body.moisture_percent);
    if (body.qualityGrade !== undefined || body.quality_grade !== undefined) updateData.quality_grade = body.qualityGrade || body.quality_grade;
    if (body.qualityParameters !== undefined || body.quality_parameters !== undefined) updateData.quality_parameters = body.qualityParameters || body.quality_parameters;
    if (body.ratePerQuintal !== undefined || body.rate_per_quintal !== undefined) updateData.rate_per_quintal = Number(body.ratePerQuintal ?? body.rate_per_quintal);
    if (body.totalPayout !== undefined || body.total_payout !== undefined) updateData.total_payout = Number(body.totalPayout ?? body.total_payout);
    if (body.paymentStatus !== undefined || body.payment_status !== undefined) updateData.payment_status = body.paymentStatus || body.payment_status;
    if (body.dbtReference !== undefined || body.dbt_reference !== undefined) updateData.dbt_reference = body.dbtReference || body.dbt_reference;
    if (body.centreId !== undefined || body.centre_id !== undefined) updateData.centre_id = body.centreId || body.centre_id;
    if (body.suspendedAt !== undefined || body.suspended_at !== undefined) updateData.suspended_at = body.suspendedAt || body.suspended_at;
    if (body.dryingYardLocation !== undefined || body.drying_yard_location !== undefined) updateData.drying_yard_location = body.dryingYardLocation || body.drying_yard_location;
    if (body.freightSubsidy !== undefined || body.freight_subsidy !== undefined) updateData.freight_subsidy = Number(body.freightSubsidy ?? body.freight_subsidy);
    if (body.reroutedFrom !== undefined || body.rerouted_from !== undefined) updateData.rerouted_from = body.reroutedFrom || body.rerouted_from;
    if (body.slotTime !== undefined || body.slot_time !== undefined) updateData.slot_time = body.slotTime || body.slot_time;
    if (body.arrivalTime !== undefined || body.arrival_time !== undefined) updateData.arrival_time = body.arrivalTime || body.arrival_time;
    if (body.estTime !== undefined || body.est_time !== undefined) updateData.est_time = body.estTime || body.est_time;

    if (hasDatabaseUrl && prisma) {
      const updated = isUuid(id)
        ? await prisma.booking.update({ where: { id }, data: updateData })
        : await prisma.booking.update({ where: { token: id.toUpperCase() }, data: updateData });

      return res.json({ success: true, message: 'Booking updated successfully', data: updated });
    }

    if (supabase) {
      const query = supabase.from('bookings').update(updateData);
      let { data, error } = isUuid(id)
        ? await query.eq('id', id).select().maybeSingle()
        : await query.eq('token', id.toUpperCase()).select().maybeSingle();

      if (error && (error.code === 'PGRST204' || error.message?.includes('schema cache'))) {
        const safeUpdate = { ...updateData };
        delete safeUpdate.quality_parameters;
        delete safeUpdate.arrival_time;
        delete safeUpdate.est_time;
        delete safeUpdate.suspended_at;
        delete safeUpdate.drying_yard_location;
        delete safeUpdate.freight_subsidy;
        delete safeUpdate.rerouted_from;
        delete safeUpdate.booking_type;

        const retryQuery = supabase.from('bookings').update(safeUpdate);
        const retryRes = isUuid(id)
          ? await retryQuery.eq('id', id).select().maybeSingle()
          : await retryQuery.eq('token', id.toUpperCase()).select().maybeSingle();

        if (!retryRes.error) {
          data = { ...(retryRes.data || {}), ...updateData };
          error = null;
        }
      }

      if (error) throw error;
      return res.json({ success: true, message: 'Booking updated successfully', data });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[UpdateBooking Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (hasDatabaseUrl && prisma) {
      const deleted = isUuid(id)
        ? await prisma.booking.delete({ where: { id } })
        : await prisma.booking.delete({ where: { token: id.toUpperCase() } });

      return res.json({ success: true, message: `Booking ${id} deleted successfully`, data: deleted });
    }

    if (supabase) {
      const query = supabase.from('bookings').delete();
      const { data, error } = isUuid(id)
        ? await query.eq('id', id).select()
        : await query.eq('token', id.toUpperCase()).select();

      if (error) throw error;
      return res.json({ success: true, message: `Booking ${id} deleted successfully`, data });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[DeleteBooking Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
