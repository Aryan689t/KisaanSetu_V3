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
        ? await query.eq('id', identifier).select().single()
        : await query.eq('token', identifier.toUpperCase()).select().single();

      if (error) throw error;
      return res.json({
        success: true,
        message: `Token ${data.token} checked in successfully at gate`,
        data
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
        ? await query.eq('id', identifier).select().single()
        : await query.eq('token', identifier.toUpperCase()).select().single();

      if (error) throw error;
      return res.json({
        success: true,
        message: `Token ${data.token} called to ${counter}`,
        data
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[Operator CallNext Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const completeProcurement = async (req, res) => {
  try {
    const {
      token,
      bookingId,
      actualQty,
      moisturePercent = 12.4,
      qualityGrade = 'Grade A',
      ratePerQuintal = 2200
    } = req.body;

    const identifier = token || bookingId;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Token or bookingId is required' });
    }

    if (!actualQty || Number(actualQty) <= 0) {
      return res.status(400).json({ success: false, message: 'actualQty must be greater than 0' });
    }

    const qty = Number(actualQty);
    const rate = Number(ratePerQuintal) || 2200;
    const totalPayout = Math.round(qty * rate);

    const payload = {
      actual_qty: qty,
      moisture_percent: Number(moisturePercent),
      quality_grade: qualityGrade,
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
      const { data, error } = isUuid(identifier)
        ? await query.eq('id', identifier).select().single()
        : await query.eq('token', identifier.toUpperCase()).select().single();

      if (error) throw error;
      return res.json({
        success: true,
        message: `Procurement completed for ${data.token}. Total payout: ₹${totalPayout.toLocaleString()}`,
        data
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[Operator CompleteProcurement Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
