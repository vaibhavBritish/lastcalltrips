const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const port = parseInt(process.env.PORT || '80', 10);
const dev = false
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`🚀 Server running on port ${port} in ${dev ? 'development' : 'production'} mode`);
    });
  })
  .catch((err) => {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  });
