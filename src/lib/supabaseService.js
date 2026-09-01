import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Creates a slot booking in Supabase 'bookings' table
 */
export async function createSlotBooking(bookingData) {
  if (!isSupabaseConfigured) {
    console.warn('[Supabase Realtime] Supabase keys not set. Operating in local demo mode.');
    return {
      success: true,
      mode: 'mock',
      data: {
        id: `bk-${Date.now()}`,
        ...bookingData,
        created_at: new Date().toISOString()
      }
    };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          centre_id: bookingData.centreId,
          farmer_name: bookingData.farmerName || 'Ramesh Singh',
          crop_name: bookingData.cropName,
          slot_time: bookingData.slotTime,
          expected_qty: Number(bookingData.expectedQty),
          token: bookingData.token || `SNP-0${Math.floor(20 + Math.random() * 80)}`,
          status: 'WAITING',
          rate_per_quintal: 2200,
          payment_status: 'PENDING'
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      mode: 'supabase',
      data: data[0]
    };
  } catch (err) {
    console.error('[Supabase Realtime Error] createSlotBooking failed:', err.message);
    return {
      success: false,
      error: err.message,
      mode: 'fallback',
      data: bookingData
    };
  }
}

/**
 * Fetches active queue metrics for a specific procurement centre
 */
export async function fetchActiveQueueMetrics(centreId = 'cnt-sonipat') {
  if (!isSupabaseConfigured) {
    return { count: 34, currentToken: 'SNP-014', mode: 'mock' };
  }

  try {
    const { data, error, count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .eq('centre_id', centreId)
      .in('status', ['WAITING', 'CHECKED_IN', 'PROCESSING']);

    if (error) throw error;

    const currentServing = data.find(d => d.status === 'PROCESSING') || data[0];

    return {
      count: count || 0,
      currentToken: currentServing?.token || 'SNP-014',
      items: data,
      mode: 'supabase'
    };
  } catch (err) {
    console.error('[Supabase Realtime Error] fetchActiveQueueMetrics failed:', err.message);
    return { count: 34, currentToken: 'SNP-014', mode: 'fallback' };
  }
}

/**
 * Subscribes to Realtime token status transitions for a given procurement centre
 */
export function subscribeToTokenUpdates(centreId, onUpdate) {
  if (!isSupabaseConfigured) {
    return () => {};
  }

  const channel = supabase
    .channel(`mandi-queue-${centreId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings'
      },
      (payload) => {
        console.log('[Supabase Realtime Event]', payload.eventType, payload.new || payload.old);
        if (onUpdate) {
          onUpdate(payload);
        }
      }
    )
    .subscribe((status) => {
      console.log(`[Supabase Realtime] Channel status for ${centreId}:`, status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
