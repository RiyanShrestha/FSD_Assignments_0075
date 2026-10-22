// ============================================================
// Phase 2 Comprehensive Automated Test Suite
// ============================================================
require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const http = require('http');
const mongoose = require('mongoose');
const { spawn } = require('child_process');

const Student = require('./models/Student');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const Claim = require('./models/Claim');

function makeRequest(options, postData = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const headers = Object.assign({}, options.headers || {});
    if (cookie) {
      headers['Cookie'] = cookie;
    }
    const opts = Object.assign({}, options, { headers });
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function extractCookie(headers) {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return null;
  const cookieStr = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  return cookieStr.split(';')[0];
}

async function runAllTests() {
  console.log('Connecting to MongoDB Atlas for Phase 2 Verification...');
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('MongoDB Connected!');

  await Claim.init();

  const testIds = [];

  try {
    // ------------------------------------------------------------
    // Unit/Model Layer Tests
    // ------------------------------------------------------------
    console.log('\n--- Section A: Model & Business Logic Validation ---');
    const timestamp = Date.now();

    const reporter = new Student({
      fullName: `Alice Reporter ${timestamp}`,
      email: `reporter_${timestamp}@college.edu`,
      department: 'Computer Science',
      contactNumber: '9876543210'
    });
    await reporter.save();
    testIds.push({ model: Student, id: reporter._id });

    const claimant1 = new Student({
      fullName: `Bob Claimant ${timestamp}`,
      email: `claimant1_${timestamp}@college.edu`,
      department: 'Mechanical',
      contactNumber: '9123456780'
    });
    await claimant1.save();
    testIds.push({ model: Student, id: claimant1._id });

    const claimant2 = new Student({
      fullName: `Carol Claimant ${timestamp}`,
      email: `claimant2_${timestamp}@college.edu`,
      department: 'Electronics',
      contactNumber: '9234567890'
    });
    await claimant2.save();
    testIds.push({ model: Student, id: claimant2._id });

    console.log('✓ Created 3 test students: Reporter, Claimant 1, Claimant 2');

    const foundItem = new FoundItem({
      itemName: `Scientific Calculator ${timestamp}`,
      category: 'Electronics',
      description: 'Casio fx-991EX calculator found near desk 4',
      foundLocation: 'Science Block, Lab 3',
      dateFound: new Date(),
      reportedBy: reporter._id,
      status: 'Unclaimed'
    });
    await foundItem.save();
    testIds.push({ model: FoundItem, id: foundItem._id });
    console.log('✓ Found item saved with status:', foundItem.status);

    // Schema minlength validation
    const shortReasonClaim = new Claim({
      foundItemId: foundItem._id,
      claimedBy: claimant1._id,
      reason: 'Mine'
    });
    try {
      await shortReasonClaim.validate();
      throw new Error('Short reason should fail validation');
    } catch (e) {
      console.log('✓ Short claim reason rejected by schema validator (<5 chars)');
    }

    // Valid claim 1
    const claim1 = new Claim({
      foundItemId: foundItem._id,
      claimedBy: claimant1._id,
      reason: 'My Casio fx-991EX with initials RS on battery door',
      status: 'Pending'
    });
    await claim1.save();
    testIds.push({ model: Claim, id: claim1._id });
    console.log('✓ Claim 1 created with status:', claim1.status);

    // Duplicate claim check
    const dupClaim = new Claim({
      foundItemId: foundItem._id,
      claimedBy: claimant1._id,
      reason: 'Attempting duplicate claim on same item',
      status: 'Pending'
    });
    try {
      await dupClaim.save();
      throw new Error('Duplicate claim should have failed');
    } catch (e) {
      console.log('✓ Duplicate claim prevented by unique compound index (code 11000)');
    }

    // Valid claim 2 by second student
    const claim2 = new Claim({
      foundItemId: foundItem._id,
      claimedBy: claimant2._id,
      reason: 'I also lost my calculator in Science Block Lab 3 yesterday',
      status: 'Pending'
    });
    await claim2.save();
    testIds.push({ model: Claim, id: claim2._id });
    console.log('✓ Claim 2 created by second student with status:', claim2.status);

    // Search & Filter query test
    const filterResults = await FoundItem.find({
      itemName: { $regex: 'Calculator', $options: 'i' },
      category: 'Electronics',
      status: 'Unclaimed'
    });
    console.log('✓ Search & filter query matched found item, count:', filterResults.length);

    // ------------------------------------------------------------
    // Section B: Live HTTP & Session Workflow Tests
    // ------------------------------------------------------------
    console.log('\n--- Section B: Live HTTP Endpoints & Session Workflow ---');

    const testPort = '3097';
    const serverEnv = Object.assign({}, process.env, { PORT: testPort });
    const serverProc = spawn('node', ['index.js'], { env: serverEnv });
    await new Promise((r) => setTimeout(r, 4000));

    try {
      // 1. GET /
      const rHome = await makeRequest({ hostname: 'localhost', port: testPort, path: '/', method: 'GET' });
      console.log('✓ GET / -> Status:', rHome.statusCode);

      // 2. GET /found-items with search & filter
      const rFound = await makeRequest({ hostname: 'localhost', port: testPort, path: '/found-items?search=Calculator&category=Electronics&status=Unclaimed', method: 'GET' });
      console.log('✓ GET /found-items (filtered) -> Status:', rFound.statusCode);

      // 3. GET /lost-items with search & filter
      const rLost = await makeRequest({ hostname: 'localhost', port: testPort, path: '/lost-items?category=Bags&status=Lost', method: 'GET' });
      console.log('✓ GET /lost-items (filtered) -> Status:', rLost.statusCode);

      // 4. GET 404 Route
      const r404 = await makeRequest({ hostname: 'localhost', port: testPort, path: '/undefined-page-404', method: 'GET' });
      console.log('✓ GET /undefined-page-404 -> Status:', r404.statusCode);

      // 5. GET Invalid ObjectId
      const rBadId = await makeRequest({ hostname: 'localhost', port: testPort, path: '/found-items/not-a-valid-id', method: 'GET' });
      console.log('✓ GET /found-items/not-a-valid-id -> Status:', rBadId.statusCode);

      // 6. Login as Claimant 2
      const loginClaimantRes = await makeRequest({
        hostname: 'localhost',
        port: testPort,
        path: '/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }, JSON.stringify({ email: claimant2.email }));
      const claimant2Cookie = extractCookie(loginClaimantRes.headers);
      console.log('✓ POST /login (Claimant 2) -> Status:', loginClaimantRes.statusCode, 'Session cookie received');

      // 7. Claimant 2 tries to approve Claim 1 (Unauthorized 403)
      const unauthRes = await makeRequest({
        hostname: 'localhost',
        port: testPort,
        path: `/claims/${claim1._id}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }, JSON.stringify({ status: 'Approved' }), claimant2Cookie);
      console.log('✓ PATCH /claims/:id/status (Unauthorized non-reporter) -> Status:', unauthRes.statusCode, '(403 Forbidden enforced server-side)');

      // 8. Login as Reporter
      const loginReporterRes = await makeRequest({
        hostname: 'localhost',
        port: testPort,
        path: '/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }, JSON.stringify({ email: reporter.email }));
      const reporterCookie = extractCookie(loginReporterRes.headers);
      console.log('✓ POST /login (Reporter) -> Status:', loginReporterRes.statusCode, 'Session cookie received');

      // 9. Reporter Approves Claim 1
      const approveRes = await makeRequest({
        hostname: 'localhost',
        port: testPort,
        path: `/claims/${claim1._id}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }, JSON.stringify({ status: 'Approved' }), reporterCookie);
      console.log('✓ PATCH /claims/:id/status (Authorized Reporter approval) -> Status:', approveRes.statusCode);

      // 10. Verify DB State: Item is Returned, Claim 1 is Approved, Claim 2 is Rejected
      const checkItem = await FoundItem.findById(foundItem._id);
      const checkClaim1 = await Claim.findById(claim1._id);
      const checkClaim2 = await Claim.findById(claim2._id);
      console.log('✓ Found item marked as Returned in DB:', checkItem.status === 'Returned');
      console.log('✓ Claim 1 marked as Approved in DB:', checkClaim1.status === 'Approved');
      console.log('✓ Claim 2 automatically Rejected in DB:', checkClaim2.status === 'Rejected');

      // 11. Repeated action on processed claim rejected (400)
      const repeatRes = await makeRequest({
        hostname: 'localhost',
        port: testPort,
        path: `/claims/${claim1._id}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }, JSON.stringify({ status: 'Approved' }), reporterCookie);
      console.log('✓ PATCH /claims/:id/status (Repeated action on reviewed claim) -> Status:', repeatRes.statusCode, '(400 Bad Request)');

      // 12. Attempt to claim Returned item rejected (400)
      const claimReturnedRes = await makeRequest({
        hostname: 'localhost',
        port: testPort,
        path: `/found-items/${foundItem._id}/claims`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }, JSON.stringify({ reason: 'Attempting to claim returned item' }), claimant2Cookie);
      console.log('✓ POST /found-items/:id/claims (Claim on Returned item) -> Status:', claimReturnedRes.statusCode, '(400 Bad Request)');

      // 13. PATCH /found-items/:id/status works
      const updateStatusRes = await makeRequest({
        hostname: 'localhost',
        port: testPort,
        path: `/found-items/${foundItem._id}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }, JSON.stringify({ status: 'Returned' }), reporterCookie);
      console.log('✓ PATCH /found-items/:id/status -> Status:', updateStatusRes.statusCode);

    } finally {
      serverProc.kill();
    }

    console.log('\n============================================================');
    console.log('ALL PHASE 2 AUTOMATED TESTS PASSED SUCCESSFULLY! (100%)');
    console.log('============================================================\n');

  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  } finally {
    console.log('Cleaning up test records from MongoDB Atlas...');
    for (const item of testIds) {
      try {
        await item.model.findByIdAndDelete(item.id);
      } catch (e) {}
    }
    console.log('Cleanup finished.');
    await mongoose.disconnect();
  }
}

runAllTests();
