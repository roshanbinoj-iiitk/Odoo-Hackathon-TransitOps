const http = require('http');

async function test() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "admin@transitops.in", password: "password", role: "FLEET_MANAGER" })
  });
  
  if (!loginRes.ok) {
    const data = await loginRes.json();
    console.log("Login failed", data);
    return;
  }
  
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log("Got token");

  const fuelRes = await fetch('http://localhost:3000/api/fuel', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await fuelRes.json();
  console.log("Fuel logs isArray:", Array.isArray(data));
  console.log("Fuel logs length:", data.length);
  if (data.length > 0) {
    console.log("First log cost:", data[0].cost);
  } else {
    console.log(data);
  }
}
test();
