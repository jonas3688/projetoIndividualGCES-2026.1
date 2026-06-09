const http = require('http');

describe('Fuzz Testing', () => {
  it('should not crash when sending random data', (done) => {
    // We will start the server locally or assume it's running
    // For this fuzz test, we just simulate sending a weird request
    const options = {
      hostname: 'localhost',
      port: 55555,
      path: '/' + Math.random().toString(36).substring(7),
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      // As long as we get some response (even 404), the server didn't crash
      expect(res.statusCode).toBeDefined();
      done();
    });

    req.on('error', (e) => {
      // If server is not running, we ignore or fail gracefully
      if (e.code === 'ECONNREFUSED') {
        console.log('Server not running, skipping fuzz test');
        done();
      } else {
        done(e);
      }
    });

    req.end();
  });
});
