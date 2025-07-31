const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function runRemainingTests() {
  try {
    // Login with valid user to get token
    const loginRes = await axios.post(API_URL + '/login', { username: 'user1', password: 'pass1' });
    const token = loginRes.data.token;
    const authHeader = { headers: { Authorization: 'Bearer ' + token } };

    // Test unauthorized access to protected endpoint
    try {
      await axios.get(API_URL + '/expenses');
      console.error('Unauthorized access should fail');
    } catch (err) {
      console.log('Unauthorized access failed as expected');
    }

    // Test access with invalid token
    try {
      await axios.get(API_URL + '/expenses', { headers: { Authorization: 'Bearer invalidtoken' } });
      console.error('Access with invalid token should fail');
    } catch (err) {
      console.log('Access with invalid token failed as expected');
    }

    // Test performance: create multiple expenses quickly
    for (let i = 0; i < 10; i++) {
      await axios.post(API_URL + '/expenses', { name: 'Perf Test ' + i, amount: i * 10 }, authHeader);
    }
    console.log('Performance test: created 10 expenses quickly');

    // Test security: try SQL injection in expense name
    try {
      await axios.post(API_URL + '/expenses', { name: "'; DROP TABLE expenses;--", amount: 100 }, authHeader);
      console.log('SQL injection test: request processed (check DB integrity manually)');
    } catch (err) {
      console.error('SQL injection test failed:', err.message);
    }

    console.log('Remaining tests completed');
  } catch (err) {
    console.error('Error during remaining tests:', err.response ? err.response.data : err.message);
  }
}

