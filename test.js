const http = require('http');
http.get('http://localhost:8080', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200 && data.includes('<title>Mestre - Avaliação e Prescrição Inteligente</title>')) {
      console.log('Test passed: Server is running and serving index.html');
      process.exit(0);
    } else {
      console.error('Test failed:', res.statusCode);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Error connecting to server:', err);
  process.exit(1);
});
