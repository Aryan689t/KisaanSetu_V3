import { prisma, supabase, hasDatabaseUrl } from '../config/db.js';

const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export const getAdminOverview = async (req, res) => {
  try {
    let bookings = [];
    let centresCount = 4;

    if (hasDatabaseUrl && prisma) {
      bookings = await prisma.booking.findMany();
      centresCount = await prisma.centre.count();
    } else if (supabase) {
      const { data: bData } = await supabase.from('bookings').select('*');
      const { count: cCount } = await supabase.from('centres').select('id', { count: 'exact', head: true });
      bookings = bData || [];
      centresCount = cCount || 4;
    }

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const pendingPayments = bookings.filter(b => b.payment_status === 'PENDING_DISBURSAL');
    const disbursedBookings = bookings.filter(b => b.payment_status === 'DISBURSED');

    const totalVolume = bookings.reduce((sum, b) => sum + (Number(b.actual_qty) || Number(b.expected_qty) || 0), 0);
    const totalDisbursedPayout = disbursedBookings.reduce((sum, b) => sum + (Number(b.total_payout) || 0), 0);

    return res.json({
      success: true,
      data: {
        activeCentres: centresCount,
        totalBookings,
        completedBookings,
        pendingPaymentCount: pendingPayments.length,
        disbursedCount: disbursedBookings.length,
        totalVolumeQuintals: Math.round(totalVolume * 100) / 100,
        totalDisbursedPayout: Math.round(totalDisbursedPayout),
        systemHealth: 'OPERATIONAL'
      }
    });
  } catch (error) {
    console.error('[Admin Overview Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingPayments = async (req, res) => {
  try {
    if (hasDatabaseUrl && prisma) {
      const pending = await prisma.booking.findMany({
        where: { payment_status: 'PENDING_DISBURSAL' },
        include: { centre: true },
        orderBy: { created_at: 'desc' }
      });
      return res.json({ success: true, count: pending.length, data: pending });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, centres(*)')
        .eq('payment_status', 'PENDING_DISBURSAL')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json({ success: true, count: (data || []).length, data: data || [] });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[Admin PendingPayments Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const disbursePayment = async (req, res) => {
  try {
    const { token, bookingId, dbtReference } = req.body;
    const identifier = token || bookingId;

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Token or bookingId is required' });
    }

    const refToUse = dbtReference || `DBT-UTIB000${Math.floor(100000 + Math.random() * 900000)}`;

    const payload = {
      payment_status: 'DISBURSED',
      dbt_reference: refToUse
    };

    if (hasDatabaseUrl && prisma) {
      const updated = isUuid(identifier)
        ? await prisma.booking.update({ where: { id: identifier }, data: payload })
        : await prisma.booking.update({ where: { token: identifier.toUpperCase() }, data: payload });

      return res.json({
        success: true,
        message: `DBT Payment authorized for ${updated.token}. Reference: ${refToUse}`,
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
        message: `DBT Payment authorized for ${data.token}. Reference: ${refToUse}`,
        data
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[Admin DisbursePayment Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
