import { prisma, supabase, hasDatabaseUrl } from '../config/db.js';

const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export const getCentreQueue = async (req, res) => {
  try {
    const { centreId } = req.params;

    if (hasDatabaseUrl && prisma) {
      const centre = await prisma.centre.findUnique({ where: { id: centreId } });
      const activeBookings = await prisma.booking.findMany({
        where: {
          centre_id: centreId,
          status: { in: ['WAITING', 'CHECKED_IN', 'PROCESSING'] }
        },
        orderBy: { created_at: 'asc' }
      });

      const currentProcessing = activeBookings.find(b => b.status === 'PROCESSING');
      const waitingCount = activeBookings.filter(b => b.status === 'WAITING' || b.status === 'CHECKED_IN').length;

      return res.json({
        success: true,
        centreId,
        centreName: centre?.name || 'Sonipat Main Procurement Centre',
        activeCounters: centre?.active_counters || 4,
        totalActive: activeBookings.length,
        waitingCount,
        currentServingToken: currentProcessing?.token || 'None',
        estWaitMinutesPerFarmer: 8,
        queue: activeBookings
      });
    }

    if (supabase) {
      const { data: centre } = await supabase.from('centres').select('*').eq('id', centreId).single();
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('centre_id', centreId)
        .in('status', ['WAITING', 'CHECKED_IN', 'PROCESSING'])
        .order('created_at', { ascending: true });

      if (error) throw error;

      const activeList = bookings || [];
      const currentProcessing = activeList.find(b => b.status === 'PROCESSING');
      const waitingCount = activeList.filter(b => b.status === 'WAITING' || b.status === 'CHECKED_IN').length;

      return res.json({
        success: true,
        centreId,
        centreName: centre?.name || 'Sonipat Main Procurement Centre',
        activeCounters: centre?.active_counters || 4,
        totalActive: activeList.length,
        waitingCount,
        currentServingToken: currentProcessing?.token || 'None',
        estWaitMinutesPerFarmer: 8,
        queue: activeList
      });
    }

    return res.status(503).json({ success: false, message: 'Database connection unavailable' });
  } catch (error) {
    console.error('[GetCentreQueue Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getQueuePosition = async (req, res) => {
  try {
    const { centreId, bookingId } = req.params;

    let activeBookings = [];

    if (hasDatabaseUrl && prisma) {
      activeBookings = await prisma.booking.findMany({
        where: {
          centre_id: centreId,
          status: { in: ['WAITING', 'CHECKED_IN', 'PROCESSING'] }
        },
        orderBy: { created_at: 'asc' }
      });
    } else if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('centre_id', centreId)
        .in('status', ['WAITING', 'CHECKED_IN', 'PROCESSING'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      activeBookings = data || [];
    }

    const index = activeBookings.findIndex(b => isUuid(bookingId) ? b.id === bookingId : b.token === bookingId.toUpperCase());

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Booking '${bookingId}' is not active in queue for centre '${centreId}'`
      });
    }

    let activeCounters = 4;
    if (hasDatabaseUrl && prisma) {
      const centre = await prisma.centre.findUnique({ where: { id: centreId } });
      if (centre?.active_counters) activeCounters = Math.max(1, Number(centre.active_counters));
    } else if (supabase) {
      const { data: centre } = await supabase.from('centres').select('active_counters').eq('id', centreId).maybeSingle();
      if (centre?.active_counters) activeCounters = Math.max(1, Number(centre.active_counters));
    }

    const targetBooking = activeBookings[index];
    const farmersAhead = Math.max(0, index);
    const estWaitMinutes = targetBooking.status === 'COMPLETED' 
      ? 0 
      : (farmersAhead === 0 ? 4 : Math.max(5, Math.round((farmersAhead * 8) / activeCounters)));

    return res.json({
      success: true,
      data: {
        token: targetBooking.token,
        status: targetBooking.status,
        position: index + 1,
        farmersAhead,
        estWaitMinutes,
        centreId,
        counter: targetBooking.counter
      }
    });
  } catch (error) {
    console.error('[GetQueuePosition Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
