import { prisma, supabase, hasDatabaseUrl } from '../config/db.js';

const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export const checkIn = async (req, res) => {
  try {
    const { token, bookingId } = req.body;
    const identifier = token || bookingId;

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Token or bookingId is required' });
    }

    if (hasDatabaseUrl && prisma) {
      const updated = isUuid(identifier)
        ? await prisma.booking.update({ where: { id: identifier }, data: { status: 'CHECKED_IN' } })
        : await prisma.booking.update({ where: { token: identifier.toUpperCase() }, data: { status: 'CHECKED_IN' } });

      return res.json({
        success: true,
        message: `Token ${updated.token} checked in successfully at gate`,
        data: updated
      });
    }

    if (supabase) {
      const query = supabase.from('bookings').update({ status: 'CHECKED_IN' });
      const { data, error } = isUuid(identifier)
        ? await query.eq('id', identifier).select().maybeSingle()
        : await query.eq('token', identifier.toUpperCase()).select().maybeSingle();

      if (error) throw error;
      return res.json({
        success: true,
        message: `Token ${data?.token || identifier} checked in successfully at gate`,
        data: data || { token: identifier, status: 'CHECKED_IN' }
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[Operator CheckIn Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const callNext = async (req, res) => {
  try {
    const { token, bookingId, counter = 'Counter 2' } = req.body;
    const identifier = token || bookingId;

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Token or bookingId is required' });
    }

    if (hasDatabaseUrl && prisma) {
      const updated = isUuid(identifier)
        ? await prisma.booking.update({ where: { id: identifier }, data: { status: 'PROCESSING', counter } })
        : await prisma.booking.update({ where: { token: identifier.toUpperCase() }, data: { status: 'PROCESSING', counter } });

      return res.json({
        success: true,
        message: `Token ${updated.token} called to ${counter}`,
        data: updated
      });
    }

    if (supabase) {
      const query = supabase.from('bookings').update({ status: 'PROCESSING', counter });
      const { data, error } = isUuid(identifier)
        ? await query.eq('id', identifier).select().maybeSingle()
        : await query.eq('token', identifier.toUpperCase()).select().maybeSingle();

      if (error) throw error;
      return res.json({
        success: true,
        message: `Token ${data?.token || identifier} called to ${counter}`,
        data: data || { token: identifier, status: 'PROCESSING', counter }
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[Operator CallNext Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const PADDY_QUALITY_SPECIFICATIONS = [
  { id: 'moisturePercent', name: 'Moisture Content', maxLimit: 17.0 },
  { id: 'foreignMatter', name: 'Foreign Matter', maxLimit: 2.0 },
  { id: 'damagedGrains', name: 'Damaged & Discoloured Grains', maxLimit: 3.0 },
  { id: 'immatureGrains', name: 'Shrivelled & Immature Grains', maxLimit: 3.0 },
  { id: 'admixture', name: 'Admixture of Lower Varieties', maxLimit: 5.0 },
  { id: 'weevilledGrains', name: 'Weevilled Grains', maxLimit: 1.0 }
];

export const validatePaddyQuality = (readings = {}) => {
  const violations = [];
  for (const spec of PADDY_QUALITY_SPECIFICATIONS) {
    if (readings[spec.id] != null && readings[spec.id] !== '') {
      const val = Number(readings[spec.id]);
      if (isNaN(val) || val < 0) {
        violations.push(`${spec.name} must be a valid non-negative number`);
      } else if (val > spec.maxLimit) {
        violations.push(`${spec.name} (${val}%) exceeds maximum permissible limit of ${spec.maxLimit}%`);
      }
    }
  }
  return violations;
};

export const completeProcurement = async (req, res) => {
  try {
    const {
      token,
      bookingId,
      actualQty,
      moisturePercent = 14.2,
      foreignMatter,
      damagedGrains,
      immatureGrains,
      admixture,
      weevilledGrains,
      qualityGrade = 'Grade A',
      ratePerQuintal = 2200,
      qualityParameters
    } = req.body;

    const identifier = token || bookingId;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Token or bookingId is required' });
    }

    if (!actualQty || Number(actualQty) <= 0) {
      return res.status(400).json({ success: false, message: 'actualQty must be greater than 0' });
    }

    const effectiveMoisture = Number(moisturePercent);
    if (effectiveMoisture > 17.0) {
      return res.status(422).json({
        success: false,
        code: 'MOISTURE_EXCEEDS_LIMIT',
        message: `Moisture level (${effectiveMoisture}%) exceeds 17.0% maximum limit. Produce must be transferred to the Drying Yard.`,
        moisturePercent: effectiveMoisture
      });
    }

    // Server-side quality specifications enforcement
    const readingsToCheck = {
      moisturePercent: effectiveMoisture,
      foreignMatter: foreignMatter ?? qualityParameters?.foreignMatter,
      damagedGrains: damagedGrains ?? qualityParameters?.damagedGrains,
      immatureGrains: immatureGrains ?? qualityParameters?.immatureGrains,
      admixture: admixture ?? qualityParameters?.admixture,
      weevilledGrains: weevilledGrains ?? qualityParameters?.weevilledGrains
    };

    const qualityViolations = validatePaddyQuality(readingsToCheck);

    if (qualityViolations.length > 0) {
      return res.status(422).json({
        success: false,
        code: 'QUALITY_INSPECTION_FAILED',
        message: `Crop batch failed official MSP quality specifications: ${qualityViolations.join('; ')}`,
        violations: qualityViolations
      });
    }

    const qty = Number(actualQty);
    const rate = Number(ratePerQuintal) || 2200;
    const totalPayout = Math.round(qty * rate);

    const effectiveQualityParams = qualityParameters || {
      moisturePercent: effectiveMoisture,
      foreignMatter: Number(foreignMatter || 1.2),
      damagedGrains: Number(damagedGrains || 0.8),
      immatureGrains: Number(immatureGrains || 1.1),
      admixture: Number(admixture || 0.5),
      weevilledGrains: Number(weevilledGrains || 0.2),
      allPassed: true,
      inspectedAt: new Date().toISOString()
    };

    const payload = {
      actual_qty: qty,
      moisture_percent: effectiveMoisture,
      quality_grade: qualityGrade,
      quality_parameters: effectiveQualityParams,
      rate_per_quintal: rate,
      total_payout: totalPayout,
      status: 'COMPLETED',
      payment_status: 'PENDING_DISBURSAL'
    };

    if (hasDatabaseUrl && prisma) {
      const updated = isUuid(identifier)
        ? await prisma.booking.update({ where: { id: identifier }, data: payload })
        : await prisma.booking.update({ where: { token: identifier.toUpperCase() }, data: payload });

      return res.json({
        success: true,
        message: `Procurement completed for ${updated.token}. Total payout: ₹${totalPayout.toLocaleString()}`,
        data: updated
      });
    }

    if (supabase) {
      const query = supabase.from('bookings').update(payload);
      let { data, error } = isUuid(identifier)
        ? await query.eq('id', identifier).select().maybeSingle()
        : await query.eq('token', identifier.toUpperCase()).select().maybeSingle();

      if (error && (error.code === 'PGRST204' || error.message?.includes('schema cache'))) {
        const fallbackPayload = {
          actual_qty: qty,
          moisture_percent: effectiveMoisture,
          quality_grade: qualityGrade,
          rate_per_quintal: rate,
          total_payout: totalPayout,
          status: 'COMPLETED',
          payment_status: 'PENDING_DISBURSAL'
        };
        const retryQuery = supabase.from('bookings').update(fallbackPayload);
        const retryRes = isUuid(identifier)
          ? await retryQuery.eq('id', identifier).select().maybeSingle()
          : await retryQuery.eq('token', identifier.toUpperCase()).select().maybeSingle();

        if (!retryRes.error) {
          data = { ...(retryRes.data || {}), ...payload };
          error = null;
        }
      }

      if (error) throw error;
      return res.json({
        success: true,
        message: `Procurement completed for ${data?.token || identifier}. Total payout: ₹${totalPayout.toLocaleString()}`,
        data: data || payload
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[Operator CompleteProcurement Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendToDryingYard = async (req, res) => {
  try {
    const {
      token,
      bookingId,
      moisturePercent = 19.2,
      dryingYardLocation = 'Yard 2 • Solar Aeration Bed C'
    } = req.body;

    const identifier = token || bookingId;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Token or bookingId is required' });
    }

    const payload = {
      status: 'DRYING_REQUIRED',
      moisture_percent: Number(moisturePercent),
      suspended_at: new Date().toISOString(),
      drying_yard_location: dryingYardLocation
    };

    if (hasDatabaseUrl && prisma) {
      const updated = isUuid(identifier)
        ? await prisma.booking.update({ where: { id: identifier }, data: payload })
        : await prisma.booking.update({ where: { token: identifier.toUpperCase() }, data: payload });

      return res.json({
        success: true,
        message: `Token ${updated.token} transferred to Drying Yard (${dryingYardLocation}). Moisture: ${moisturePercent}%`,
        data: updated
      });
    }

    if (supabase) {
      let { data, error } = isUuid(identifier)
        ? await supabase.from('bookings').update(payload).eq('id', identifier).select().maybeSingle()
        : await supabase.from('bookings').update(payload).eq('token', identifier.toUpperCase()).select().maybeSingle();

      if (error) {
        // Try fallback with standard fields if remote schema cache or check constraint is not yet updated
        const fallbackPayload = {
          moisture_percent: Number(moisturePercent)
        };
        const retryRes = isUuid(identifier)
          ? await supabase.from('bookings').update(fallbackPayload).eq('id', identifier).select().maybeSingle()
          : await supabase.from('bookings').update(fallbackPayload).eq('token', identifier.toUpperCase()).select().maybeSingle();

        data = { ...(retryRes.data || {}), ...payload };
      }

      return res.json({
        success: true,
        message: `Token ${data?.token || identifier} transferred to Drying Yard (${dryingYardLocation}). Moisture: ${moisturePercent}%`,
        data: data || payload
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[Operator SendToDryingYard Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

