const http = require('http');
const fs = require('fs');
const path = require('path');
const { createGzip, createBrotliCompress } = require('zlib');

const port = process.env.PORT || 8080;
const root = path.join(__dirname);
const distRoot = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ogg': 'audio/ogg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = reqPath.startsWith('/dist/') ?
    path.join(distRoot, reqPath.slice('/dist/'.length)) :
    path.join(root, reqPath);
  if (reqPath === '/' || reqPath === '') {
    filePath = path.join(root, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': type };
    const etag = `"${stats.size}-${stats.mtime.getTime()}"`;
    headers['ETag'] = etag;
    if (ext !== '.html') {
      headers['Cache-Control'] = 'public, max-age=86400';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers);
      res.end();
      return;
    }

    const accept = req.headers['accept-encoding'] || '';
    let stream = fs.createReadStream(filePath);
    if (/\bbr\b/.test(accept)) {
      headers['Content-Encoding'] = 'br';
      res.writeHead(200, headers);
      stream.pipe(createBrotliCompress()).pipe(res);
    } else if (/\bgzip\b/.test(accept)) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      stream.pipe(createGzip()).pipe(res);
    } else {
      res.writeHead(200, headers);
      stream.pipe(res);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
