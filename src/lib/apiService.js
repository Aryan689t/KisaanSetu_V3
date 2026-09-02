/**
 * Frontend REST API Service Layer for KisanSetu
 * Communicates with the Express backend REST API endpoints (/api).
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Normalizes a booking record from the backend into the shape required by the frontend.
 */
export function normalizeBooking(booking) {
  if (!booking) return null;
  const expectedQtyNum = booking.expected_qty != null ? Number(booking.expected_qty) : (booking.expectedQty != null ? Number(booking.expectedQty) : 40);
  const actualQtyNum = booking.actual_qty != null ? Number(booking.actual_qty) : (booking.actualQty != null ? Number(booking.actualQty) : null);
  const rateNum = booking.rate_per_quintal != null ? Number(booking.rate_per_quintal) : (booking.ratePerQuintal != null ? Number(booking.ratePerQuintal) : 2200);
  const totalPayoutNum = booking.total_payout != null 
    ? Number(booking.total_payout) 
    : (booking.totalAmount != null ? Number(booking.totalAmount) : (actualQtyNum != null ? Math.round(actualQtyNum * rateNum) : null));

  const centreName = booking.centre?.name || booking.centre_name || booking.centreName || 
    (booking.centre_id === 'cnt-sonipat' ? 'Sonipat Main Procurement Centre' : 
     booking.centre_id === 'cnt-panipat' ? 'Panipat Grain Mandi' : 
     booking.centre_id === 'cnt-karnal' ? 'Karnal Central Yard' : 'Sonipat Main Procurement Centre');

  const formulaStr = actualQtyNum != null 
    ? `${actualQtyNum} quintals × ₹${rateNum.toLocaleString()}/quintal = ₹${totalPayoutNum.toLocaleString()}`
    : `${expectedQtyNum} quintals × ₹${rateNum.toLocaleString()}/quintal (Est.)`;

  return {
    id: booking.id,
    token: booking.token,
    centreId: booking.centre_id || booking.centreId,
    centre_id: booking.centre_id || booking.centreId,
    centreName,
    farmerName: booking.farmer_name || booking.farmerName || 'Ramesh Singh (YOU)',
    farmer_name: booking.farmer_name || booking.farmerName || 'Ramesh Singh (YOU)',
    mobile: booking.mobile || '+91 98765 43210',
    aadhaarLast4: booking.aadhaar_last4 || booking.aadhaarLast4 || '4821',
    crop: booking.crop_name || booking.cropName || booking.crop || 'Paddy (Grade A)',
    cropName: booking.crop_name || booking.cropName || booking.crop || 'Paddy (Grade A)',
    crop_name: booking.crop_name || booking.cropName || booking.crop || 'Paddy (Grade A)',
    slotTime: booking.slot_time || booking.slotTime || '11:00 AM - 11:30 AM',
    slot_time: booking.slot_time || booking.slotTime || '11:00 AM - 11:30 AM',
    expectedQty: expectedQtyNum,
    expected_qty: expectedQtyNum,
    actualQty: actualQtyNum,
    actual_qty: actualQtyNum,
    moisturePercent: booking.moisture_percent != null ? Number(booking.moisture_percent) : null,
    moisture_percent: booking.moisture_percent != null ? Number(booking.moisture_percent) : null,
    qualityGrade: booking.quality_grade || booking.qualityGrade || null,
    quality_grade: booking.quality_grade || booking.qualityGrade || null,
    counter: booking.counter || 'Counter 2',
    status: (booking.status || 'WAITING').toUpperCase(),
    ratePerQuintal: rateNum,
    rate_per_quintal: rateNum,
    totalPayout: totalPayoutNum,
    totalAmount: totalPayoutNum,
    formula: formulaStr,
    paymentStatus: (booking.payment_status || booking.paymentStatus || 'PENDING').toUpperCase(),
    payment_status: (booking.payment_status || booking.paymentStatus || 'PENDING').toUpperCase(),
    dbtReference: booking.dbt_reference || booking.dbtReference || null,
    dbt_reference: booking.dbt_reference || booking.dbtReference || null,
    createdAt: booking.created_at || booking.createdAt || new Date().toISOString(),
    created_at: booking.created_at || booking.createdAt || new Date().toISOString()
  };
}

/**
 * Standard fetch helper with default headers and timeout.
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-role': options.role || 'farmer',
    ...options.headers
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Server responded with HTTP ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Please check if the backend server is running.');
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to KisanSetu backend. Please ensure the backend service is running on port 5000.');
    }
    throw error;
  }
}

/**
 * Creates a real booking via POST /api/bookings.
 * Token is generated by the backend and persisted in the database.
 */
export async function createBooking({
  centreId,
  cropName,
  slotTime,
  expectedQty,
  farmerName,
  mobile,
  aadhaarLast4
}) {
  if (!centreId) throw new Error('Procurement Centre is required');
  if (!cropName) throw new Error('Crop Name is required');
  if (!slotTime) throw new Error('Slot Time is required');
  if (!expectedQty || Number(expectedQty) <= 0) throw new Error('Expected Quantity must be greater than 0');

  const payload = {
    centreId,
    cropName,
    slotTime,
    expectedQty: Number(expectedQty),
    farmerName: farmerName || 'Ramesh Singh (YOU)',
    mobile: mobile || '+91 98765 43210',
    aadhaarLast4: aadhaarLast4 || '4821'
  };

  const response = await apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
    role: 'farmer'
  });

  if (!response?.success || !response.data) {
    throw new Error(response?.message || 'Failed to create booking');
  }

  return {
    success: true,
    message: response.message || 'Slot booked successfully',
    data: normalizeBooking(response.data)
  };
}

/**
 * Fetches bookings list from GET /api/bookings.
 */
export async function fetchBookings(filters = {}) {
  const params = new URLSearchParams();
  if (filters.centreId) params.append('centreId', filters.centreId);
  if (filters.status) params.append('status', filters.status);
  if (filters.token) params.append('token', filters.token);
  if (filters.limit) params.append('limit', filters.limit);

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await apiRequest(`/bookings${query}`, { method: 'GET' });

  return {
    success: true,
    count: response.count || (response.data || []).length,
    data: (response.data || []).map(normalizeBooking)
  };
}

/**
 * Fetches single booking by token or UUID from GET /api/bookings/:id.
 */
export async function fetchBookingById(id) {
  const response = await apiRequest(`/bookings/${encodeURIComponent(id)}`, { method: 'GET' });
  return {
    success: true,
    data: normalizeBooking(response.data)
  };
}

/**
 * Fetches live centre queue from GET /api/queue/:centreId.
 */
export async function fetchCentreQueue(centreId) {
  const response = await apiRequest(`/queue/${encodeURIComponent(centreId)}`, { method: 'GET' });
  return response;
}

/**
 * Fetches real queue position for a booking from GET /api/queue/:centreId/position/:bookingId.
 */
export async function fetchQueuePosition(centreId, bookingId) {
  const response = await apiRequest(`/queue/${encodeURIComponent(centreId)}/position/${encodeURIComponent(bookingId)}`, {
    method: 'GET'
  });
  return response;
}
