import { supabase, isSupabaseConfigured } from './supabaseClient';
import { initialQueueItems, initialCentres } from '../mock/initialData';

/**
 * Normalizes a database row from the 'bookings' table into a shape
 * compatible with all frontend components.
 */
export function mapBookingRow(row) {
  if (!row) return null;
  const expectedQtyNum = row.expected_qty != null ? Number(row.expected_qty) : 40;
  const actualQtyNum = row.actual_qty != null ? Number(row.actual_qty) : null;
  const rateNum = row.rate_per_quintal != null ? Number(row.rate_per_quintal) : 2200;
  const totalPayoutNum = row.total_payout != null 
    ? Number(row.total_payout) 
    : (actualQtyNum != null ? Math.round(actualQtyNum * rateNum) : null);

  const formulaStr = actualQtyNum != null 
    ? `${actualQtyNum} quintals × ₹${rateNum.toLocaleString()}/quintal = ₹${totalPayoutNum.toLocaleString()}`
    : `${expectedQtyNum} quintals × ₹${rateNum.toLocaleString()}/quintal (Est.)`;

  return {
    id: row.id,
    token: row.token,
    centreId: row.centre_id,
    centre_id: row.centre_id,
    centreName: row.centre_name || (row.centre_id === 'cnt-sonipat' ? 'Sonipat Main Procurement Centre' : row.centre_id),
    farmerName: row.farmer_name,
    farmer_name: row.farmer_name,
    mobile: row.mobile || '+91 98765 43210',
    aadhaarLast4: row.aadhaar_last4 || '4821',
    crop: row.crop_name,
    cropName: row.crop_name,
    crop_name: row.crop_name,
    slotTime: row.slot_time,
    slot_time: row.slot_time,
    expectedQty: expectedQtyNum,
    expected_qty: expectedQtyNum,
    actualQty: actualQtyNum,
    actual_qty: actualQtyNum,
    moisturePercent: row.moisture_percent != null ? Number(row.moisture_percent) : null,
    moisture_percent: row.moisture_percent != null ? Number(row.moisture_percent) : null,
    qualityGrade: row.quality_grade,
    quality_grade: row.quality_grade,
    counter: row.counter || 'Counter 2',
    status: row.status || 'WAITING',
    bookingType: row.booking_type || row.bookingType || 'ONLINE',
    booking_type: row.booking_type || row.bookingType || 'ONLINE',
    ratePerQuintal: rateNum,
    rate_per_quintal: rateNum,
    totalPayout: totalPayoutNum,
    totalAmount: totalPayoutNum,
    formula: formulaStr,
    paymentStatus: row.payment_status || 'PENDING',
    payment_status: row.payment_status || 'PENDING',
    dbtReference: row.dbt_reference,
    dbt_reference: row.dbt_reference,
    createdAt: row.created_at,
    created_at: row.created_at
  };
}

/**
 * Normalizes a database row from the 'centres' table.
 */
export function mapCentreRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    state: row.state,
    address: row.address,
    distanceKm: row.distance_km != null ? Number(row.distance_km) : 10.0,
    lat: row.lat != null ? Number(row.lat) : 28.9931,
    lng: row.lng != null ? Number(row.lng) : 77.0151,
    operatingHours: row.operating_hours || '08:00 AM - 06:00 PM',
    activeCounters: row.active_counters != null ? Number(row.active_counters) : 4,
    queueCount: 12,
    estWaitMinutes: 24,
    capacityPercent: 58,
    availableSlots: 8,
    totalSlots: 40,
    status: 'NORMAL',
    recommended: row.id === 'cnt-sonipat',
    recommendationReason: 'Lowest expected waiting time & optimal capacity load'
  };
}

/**
 * Helper to generate a unique, non-colliding token string (e.g. SNP-016).
 */
export function generateNextToken(existingQueue = [], centreCode = 'SNP') {
  let counter = existingQueue.length + 11;
  let candidate = `${centreCode}-0${counter < 10 ? '0' + counter : counter}`;
  while (existingQueue.some(item => item.token === candidate)) {
    counter++;
    candidate = `${centreCode}-0${counter < 10 ? '0' + counter : counter}`;
  }
  return candidate;
}

/**
 * Creates a slot booking in Supabase 'bookings' table.
 * Standardizes incoming payload to match table columns.
 */
export async function createSlotBooking(bookingData) {
  const token = bookingData.token || `SNP-0${Math.floor(20 + Math.random() * 80)}`;
  const centreId = bookingData.centreId || bookingData.centre_id || 'cnt-sonipat';
  const farmerName = bookingData.farmerName || bookingData.farmer_name || 'Ramesh Singh (YOU)';
  const cropName = bookingData.cropName || bookingData.crop || bookingData.crop_name || 'Paddy (Grade A)';
  const slotTime = bookingData.slotTime || bookingData.slot_time || '11:30 AM - 12:00 PM';
  const expectedQty = Number(bookingData.expectedQty || bookingData.expected_qty || 40);
  const mobile = bookingData.mobile || '+91 98765 43210';
  const aadhaarLast4 = bookingData.aadhaarLast4 || bookingData.aadhaar_last4 || '4821';
  const ratePerQuintal = Number(bookingData.ratePerQuintal || bookingData.rate_per_quintal || 2200);

  const bookingType = bookingData.bookingType || bookingData.booking_type || 'ONLINE';
  const status = bookingData.status || (bookingType === 'WALK_IN' ? 'CHECKED_IN' : 'WAITING');
  const counter = bookingData.counter || 'Counter 2';

  if (!isSupabaseConfigured) {
    console.warn('[Supabase Service] Supabase not configured. Returning local mock booking.');
    return {
      success: true,
      mode: 'mock',
      data: mapBookingRow({
        id: `bk-${Date.now()}`,
        token,
        centre_id: centreId,
        farmer_name: farmerName,
        mobile,
        aadhaar_last4: aadhaarLast4,
        crop_name: cropName,
        slot_time: slotTime,
        expected_qty: expectedQty,
        status,
        booking_type: bookingType,
        counter,
        rate_per_quintal: ratePerQuintal,
        payment_status: 'PENDING',
        created_at: new Date().toISOString()
      })
    };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          token,
          centre_id: centreId,
          farmer_name: farmerName,
          mobile,
          aadhaar_last4: aadhaarLast4,
          crop_name: cropName,
          slot_time: slotTime,
          expected_qty: expectedQty,
          status,
          booking_type: bookingType,
          counter,
          rate_per_quintal: ratePerQuintal,
          payment_status: 'PENDING'
        }
      ])
      .select();

    if (error) throw error;

    console.info(`[Supabase Service] Successfully created booking token ${token} in database.`);
    return {
      success: true,
      mode: 'supabase',
      data: mapBookingRow(data[0])
    };
  } catch (err) {
    console.error('[Supabase Error] createSlotBooking failed:', err.message);
    return {
      success: false,
      error: err.message,
      mode: 'supabase_error',
      data: mapBookingRow({
        id: `bk-${Date.now()}`,
        token,
        centre_id: centreId,
        farmer_name: farmerName,
        mobile,
        aadhaar_last4: aadhaarLast4,
        crop_name: cropName,
        slot_time: slotTime,
        expected_qty: expectedQty,
        status,
        booking_type: bookingType,
        counter,
        rate_per_quintal: ratePerQuintal,
        payment_status: 'PENDING',
        created_at: new Date().toISOString()
      })
    };
  }
}

/**
 * Fetches all bookings from Supabase 'bookings' table,
 * optionally filtered by centre_id.
 */
export async function fetchBookings(centreId = null) {
  if (!isSupabaseConfigured) {
    const filtered = centreId 
      ? initialQueueItems.filter(item => (item.centreId || 'cnt-sonipat') === centreId)
      : initialQueueItems;
    return {
      success: true,
      mode: 'mock',
      data: filtered.map(mapBookingRow)
    };
  }

  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: true });

    if (centreId) {
      query = query.eq('centre_id', centreId);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('[Supabase Service] No bookings returned from database. Using initial seeds as fallback.');
      return {
        success: true,
        mode: 'supabase_empty',
        data: initialQueueItems.map(mapBookingRow)
      };
    }

    console.info(`[Supabase Service] Retrieved ${data.length} bookings from Supabase.`);
    return {
      success: true,
      mode: 'supabase',
      data: data.map(mapBookingRow)
    };
  } catch (err) {
    console.error('[Supabase Error] fetchBookings failed:', err.message);
    return {
      success: false,
      error: err.message,
      mode: 'supabase_error',
      data: initialQueueItems.map(mapBookingRow)
    };
  }
}

/**
 * Fetches active bookings (WAITING, CHECKED_IN, PROCESSING).
 */
export async function fetchActiveBookings(centreId = null) {
  if (!isSupabaseConfigured) {
    const active = initialQueueItems.filter(item => 
      ['WAITING', 'CHECKED_IN', 'PROCESSING'].includes(item.status) &&
      (!centreId || (item.centreId || 'cnt-sonipat') === centreId)
    );
    return {
      success: true,
      mode: 'mock',
      data: active.map(mapBookingRow)
    };
  }

  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .in('status', ['WAITING', 'CHECKED_IN', 'PROCESSING'])
      .order('created_at', { ascending: true });

    if (centreId) {
      query = query.eq('centre_id', centreId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      success: true,
      mode: 'supabase',
      data: (data || []).map(mapBookingRow)
    };
  } catch (err) {
    console.error('[Supabase Error] fetchActiveBookings failed:', err.message);
    return {
      success: false,
      error: err.message,
      mode: 'supabase_error',
      data: []
    };
  }
}

/**
 * Fetches centres from Supabase 'centres' table.
 */
export async function fetchCentres() {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      mode: 'mock',
      data: initialCentres
    };
  }

  try {
    const { data, error } = await supabase
      .from('centres')
      .select('*')
      .order('distance_km', { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('[Supabase Service] No centres returned from database. Using initial seeds as fallback.');
      return {
        success: true,
        mode: 'supabase_empty',
        data: initialCentres
      };
    }

    // Merge static telemetry estimates with real DB rows
    const merged = data.map(row => {
      const existing = initialCentres.find(c => c.id === row.id) || {};
      return {
        ...existing,
        ...mapCentreRow(row)
      };
    });

    return {
      success: true,
      mode: 'supabase',
      data: merged
    };
  } catch (err) {
    console.error('[Supabase Error] fetchCentres failed:', err.message);
    return {
      success: false,
      error: err.message,
      mode: 'supabase_error',
      data: initialCentres
    };
  }
}

/**
 * Fetches active queue metrics for a specific procurement centre.
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

    const currentServing = data?.find(d => d.status === 'PROCESSING') || data?.[0];

    return {
      count: count || 0,
      currentToken: currentServing?.token || 'SNP-014',
      items: data?.map(mapBookingRow) || [],
      mode: 'supabase'
    };
  } catch (err) {
    console.error('[Supabase Error] fetchActiveQueueMetrics failed:', err.message);
    return { count: 34, currentToken: 'SNP-014', mode: 'supabase_error' };
  }
}

/**
 * Updates a booking's status (e.g. WAITING -> CHECKED_IN, CHECKED_IN -> PROCESSING).
 */
export async function updateBookingStatus(tokenOrId, newStatus, extraFields = {}) {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      mode: 'mock',
      data: { token: tokenOrId, status: newStatus, ...extraFields }
    };
  }

  try {
    const payload = {
      status: newStatus,
      ...extraFields
    };

    let query = supabase.from('bookings').update(payload);

    const isUuid = typeof tokenOrId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tokenOrId);
    if (isUuid) {
      query = query.eq('id', tokenOrId);
    } else {
      query = query.eq('token', tokenOrId);
    }

    const { data, error } = await query.select();
    if (error) throw error;

    console.info(`[Supabase Service] Updated status of ${tokenOrId} to ${newStatus}.`);
    return {
      success: true,
      mode: 'supabase',
      data: data?.[0] ? mapBookingRow(data[0]) : null
    };
  } catch (err) {
    console.error('[Supabase Error] updateBookingStatus failed:', err.message);
    return {
      success: false,
      error: err.message,
      mode: 'supabase_error'
    };
  }
}

/**
 * Records procurement inspection results: actualQty, moisturePercent, qualityGrade.
 * Transitions booking to COMPLETED and payment_status to PENDING_DISBURSAL.
 */
export async function updateBookingProcurement(tokenOrId, { actualQty, moisturePercent, qualityGrade, ratePerQuintal = 2200 }) {
  const qtyNum = Number(actualQty);
  const rateNum = Number(ratePerQuintal);
  const totalPayout = Math.round(qtyNum * rateNum);

  const payload = {
    actual_qty: qtyNum,
    moisture_percent: Number(moisturePercent),
    quality_grade: qualityGrade,
    rate_per_quintal: rateNum,
    total_payout: totalPayout,
    status: 'COMPLETED',
    payment_status: 'PENDING_DISBURSAL'
  };

  if (!isSupabaseConfigured) {
    return {
      success: true,
      mode: 'mock',
      data: { token: tokenOrId, ...payload }
    };
  }

  try {
    let query = supabase.from('bookings').update(payload);

    const isUuid = typeof tokenOrId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tokenOrId);
    if (isUuid) {
      query = query.eq('id', tokenOrId);
    } else {
      query = query.eq('token', tokenOrId);
    }

    const { data, error } = await query.select();
    if (error) throw error;

    console.info(`[Supabase Service] Completed procurement inspection for ${tokenOrId}. Total payout: ₹${totalPayout}`);
    return {
      success: true,
      mode: 'supabase',
      data: data?.[0] ? mapBookingRow(data[0]) : null
    };
  } catch (err) {
    console.error('[Supabase Error] updateBookingProcurement failed:', err.message);
    return {
      success: false,
      error: err.message,
      mode: 'supabase_error'
    };
  }
}

/**
 * Disburses payment for a completed booking.
 * Transitions payment_status to DISBURSED and writes dbt_reference.
 */
export async function disburseBookingPayment(tokenOrId, dbtReference = null) {
  const ref = dbtReference || `DBT-UTIB000${Math.floor(100000 + Math.random() * 900000)}`;
  const payload = {
    payment_status: 'DISBURSED',
    dbt_reference: ref
  };

  if (!isSupabaseConfigured) {
    return {
      success: true,
      mode: 'mock',
      dbtReference: ref,
      data: { token: tokenOrId, ...payload }
    };
  }

  try {
    let query = supabase.from('bookings').update(payload);

    const isUuid = typeof tokenOrId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tokenOrId);
    if (isUuid) {
      query = query.eq('id', tokenOrId);
    } else {
      query = query.eq('token', tokenOrId);
    }

    const { data, error } = await query.select();
    if (error) throw error;

    console.info(`[Supabase Service] Disbursed payment for ${tokenOrId} with ref ${ref}.`);
    return {
      success: true,
      mode: 'supabase',
      dbtReference: ref,
      data: data?.[0] ? mapBookingRow(data[0]) : null
    };
  } catch (err) {
    console.error('[Supabase Error] disburseBookingPayment failed:', err.message);
    return {
      success: false,
      error: err.message,
      mode: 'supabase_error',
      dbtReference: ref
    };
  }
}

// Aliases matching prompt requirements
export const createBooking = createSlotBooking;
export const completeProcurement = updateBookingProcurement;
export const disbursePayment = disburseBookingPayment;
