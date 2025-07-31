const http = require('http');

// Test registration
const postData = JSON.stringify({
  username: 'testuser',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing registration API...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    // Test login if registration was successful
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\nTesting login API...');
      testLogin();
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();

function testLogin() {
  const loginData = JSON.stringify({
    username: 'testuser',
    password: 'password123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    console.log(`Login Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Login Response:', data);
    });
  });

  loginReq.on('error', (e) => {
    console.error(`Problem with login request: ${e.message}`);
  });

  loginReq.write(loginData);
  loginReq.end();
}
