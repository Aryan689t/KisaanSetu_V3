import app from '../src/app.js';
import http from 'http';

const PORT = 5099; // Dedicated test port
let server;

async function request(method, path, body = null, headers = {}) {
  const url = `http://localhost:${PORT}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runTests() {
  console.log('🚀 Starting KisanSetu Backend API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  server = app.listen(PORT);
  // Wait for server to bind
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    // 1. Health Check
    console.log('Test 1: Health Check GET /api/health');
    const health = await request('GET', '/api/health');
    if (health.status === 200 && health.data.success) {
      console.log('  ✅ PASSED: Backend is operational\n');
      passed++;
    } else {
      console.error('  ❌ FAILED:', health);
      failed++;
    }

    // 2. Auth: Demo Login
    console.log('Test 2: Auth POST /api/auth/login');
    const loginRes = await request('POST', '/api/auth/login', { role: 'operator' });
    if (loginRes.status === 200 && loginRes.data.data?.token) {
      console.log(`  ✅ PASSED: Logged in as ${loginRes.data.data.user.role}\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', loginRes);
      failed++;
    }
    const operatorToken = loginRes.data?.data?.token;

    // 3. GET /api/bookings reads real Supabase data
    console.log('Test 3: GET /api/bookings reads database');
    const bookingsRes = await request('GET', '/api/bookings?limit=5');
    if (bookingsRes.status === 200 && Array.isArray(bookingsRes.data.data) && bookingsRes.data.data.length > 0) {
      console.log(`  ✅ PASSED: Retrieved ${bookingsRes.data.count} bookings from database (Sample token: ${bookingsRes.data.data[0]?.token})\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', bookingsRes);
      failed++;
    }

    // 4. POST /api/bookings creates a real database row
    console.log('Test 4: POST /api/bookings creates real booking');
    const testToken = `TEST-${Date.now().toString().slice(-4)}`;
    const newBooking = await request('POST', '/api/bookings', {
      centreId: 'cnt-sonipat',
      cropName: 'Wheat (Sharbati)',
      slotTime: '02:00 PM - 02:30 PM',
      expectedQty: 45.0,
      farmerName: 'KisanSetu Automated Test',
      mobile: '+91 99999 88888',
      token: testToken
    });

    if (newBooking.status === 201 && newBooking.data.success && newBooking.data.data.token === testToken) {
      console.log(`  ✅ PASSED: Created booking with token ${newBooking.data.data.token} (status: ${newBooking.data.data.status})\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', newBooking);
      failed++;
    }

    // 5. GET /api/queue/:centreId returns real queue data
    console.log('Test 5: GET /api/queue/cnt-sonipat returns live queue');
    const queueRes = await request('GET', '/api/queue/cnt-sonipat');
    if (queueRes.status === 200 && queueRes.data.success && Array.isArray(queueRes.data.queue)) {
      console.log(`  ✅ PASSED: Queue loaded for ${queueRes.data.centreName} (${queueRes.data.totalActive} active)\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', queueRes);
      failed++;
    }

    // 6. Operator Check-in updates the real booking
    console.log('Test 6: POST /api/operator/check-in');
    const checkInRes = await request('POST', '/api/operator/check-in', { token: testToken }, {
      Authorization: `Bearer ${operatorToken}`
    });
    if (checkInRes.status === 200 && checkInRes.data.data?.status === 'CHECKED_IN') {
      console.log(`  ✅ PASSED: Token ${testToken} updated to CHECKED_IN\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', checkInRes);
      failed++;
    }

    // 7. Call-next updates the real booking
    console.log('Test 7: POST /api/operator/call-next');
    const callRes = await request('POST', '/api/operator/call-next', { token: testToken, counter: 'Counter 3' }, {
      Authorization: `Bearer ${operatorToken}`
    });
    if (callRes.status === 200 && callRes.data.data?.status === 'PROCESSING') {
      console.log(`  ✅ PASSED: Token ${testToken} called to Counter 3 (status: PROCESSING)\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', callRes);
      failed++;
    }

    // 8. Complete-procurement stores real procurement data
    console.log('Test 8: POST /api/operator/complete-procurement');
    const procRes = await request('POST', '/api/operator/complete-procurement', {
      token: testToken,
      actualQty: 44.2,
      moisturePercent: 12.1,
      qualityGrade: 'Grade A',
      ratePerQuintal: 2275
    }, {
      Authorization: `Bearer ${operatorToken}`
    });
    if (procRes.status === 200 && procRes.data.data?.status === 'COMPLETED' && procRes.data.data?.payment_status === 'PENDING_DISBURSAL') {
      console.log(`  ✅ PASSED: Procurement logged: ${procRes.data.data.actual_qty} Qtl @ ₹${procRes.data.data.rate_per_quintal}, payout: ₹${procRes.data.data.total_payout}\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', procRes);
      failed++;
    }

    // 9. Admin overview & DBT Payment Disbursal
    console.log('Test 9: GET /api/admin/overview & POST /api/admin/disburse-payment');
    const adminOverview = await request('GET', '/api/admin/overview', null, { 'x-role': 'admin' });
    const disburseRes = await request('POST', '/api/admin/disburse-payment', { token: testToken }, { 'x-role': 'admin' });

    if (adminOverview.status === 200 && disburseRes.status === 200 && disburseRes.data.data?.payment_status === 'DISBURSED') {
      console.log(`  ✅ PASSED: Payment disbursed for ${testToken}. DBT Ref: ${disburseRes.data.data.dbt_reference}\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', disburseRes);
      failed++;
    }

    // 10. Invalid requests return proper HTTP error codes
    console.log('Test 10: Error handling - Invalid booking creation');
    const invalidBooking = await request('POST', '/api/bookings', { centreId: 'cnt-nonexistent' });
    if (invalidBooking.status === 400 || invalidBooking.status === 404) {
      console.log(`  ✅ PASSED: Correctly returned HTTP ${invalidBooking.status}: "${invalidBooking.data?.message}"\n`);
      passed++;
    } else {
      console.error('  ❌ FAILED:', invalidBooking);
      failed++;
    }

    // Clean up test token from database
    console.log('Cleanup: Deleting test token');
    await request('DELETE', `/api/bookings/${testToken}`);
    console.log(`  🧹 Cleaned up temporary test record ${testToken}\n`);

  } catch (err) {
    console.error('Fatal Test Error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`=========================================`);
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`=========================================`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
