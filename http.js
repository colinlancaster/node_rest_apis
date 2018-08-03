// This is the most bare bones way of doing routing in Node. 

// Express is written on top of it.

const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.write("hello world");
    res.end();
  }

  if (req.url === '/api/courses') {
    res.write(JSON.stringify([1, 2, 3]))
    res.end();
  }
});

// You will never really do it this way...
// server.on('connection', (socket) => {
//   console.log('New connection!');
// });

server.listen(3000);

console.log('Listening on port 3000...');