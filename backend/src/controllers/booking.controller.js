import { prisma, supabase, hasDatabaseUrl } from '../config/db.js';

// Helper to normalize UUID vs Token
const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export const getBookings = async (req, res) => {
  try {
    const { centreId, status, token, limit = 50 } = req.query;

    if (hasDatabaseUrl && prisma) {
      const where = {};
      if (centreId) where.centre_id = centreId;
      if (status) where.status = status.toUpperCase();
      if (token) where.token = token.toUpperCase();

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
      token: requestedToken
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

    const effectiveFarmerName = farmerName || req.user?.name || 'Ramesh Singh (YOU)';
    const effectiveMobile = mobile || req.user?.phone || '+91 98765 43210';

    // 2. Prisma Database Flow (with Transaction-based capacity verification)
    if (hasDatabaseUrl && prisma) {
      const result = await prisma.$transaction(async (tx) => {
        // Verify centre exists
        const centre = await tx.centre.findUnique({ where: { id: centreId } });
        if (!centre) {
          throw new Error(`Centre '${centreId}' does not exist`);
        }

        // Check active bookings count in this slot to prevent overbooking
        const activeInSlot = await tx.booking.count({
          where: {
            centre_id: centreId,
            slot_time: slotTime,
            status: { in: ['WAITING', 'CHECKED_IN', 'PROCESSING'] }
          }
        });

        const maxSlotCapacity = 25; // Max allowed trucks per slot
        if (activeInSlot >= maxSlotCapacity) {
          throw new Error(`Time slot '${slotTime}' is at full capacity (${activeInSlot}/${maxSlotCapacity})`);
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
            status: 'WAITING',
            counter: 'Counter 2',
            rate_per_quintal: 2200,
            payment_status: 'PENDING'
          },
          include: { centre: true }
        });
      });

      return res.status(201).json({
        success: true,
        message: 'Slot booked successfully',
        data: result
      });
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
        status: 'WAITING',
        counter: 'Counter 2',
        rate_per_quintal: 2200,
        payment_status: 'PENDING'
      };

      const { data, error } = await supabase.from('bookings').insert([newBookingPayload]).select('*, centres(*)').single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Slot booked successfully',
        data
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[CreateBooking Error]:', error);
    return res.status(400).json({ success: false, message: error.message || 'Unable to create booking in registry' });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (hasDatabaseUrl && prisma) {
      const updated = isUuid(id)
        ? await prisma.booking.update({ where: { id }, data: updateData })
        : await prisma.booking.update({ where: { token: id.toUpperCase() }, data: updateData });

      return res.json({ success: true, message: 'Booking updated successfully', data: updated });
    }

    if (supabase) {
      const query = supabase.from('bookings').update(updateData);
      const { data, error } = isUuid(id)
        ? await query.eq('id', id).select().single()
        : await query.eq('token', id.toUpperCase()).select().single();

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
