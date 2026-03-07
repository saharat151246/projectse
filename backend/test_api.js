const http = require('http');

http.get('http://localhost:5000/api/orders/test', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("TEST ROUTE:", data); });
}).on("error", (err) => { console.log("Error: " + err.message); });

http.get('http://localhost:5000/api/orders/myorders', { headers: { Authorization: "Bearer test" } }, (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("MYORDERS ROUTE:", resp.statusCode, data); });
}).on("error", (err) => { console.log("Error: " + err.message); });
