'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.pdf':'application/pdf','.woff':'font/woff','.woff2':'font/woff2'};
const server = http.createServer((req,res)=>{
  let decoded;
  try {decoded=decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400);res.end('Invalid URL');return;}
  const filename=path.resolve(root,'.'+(decoded==='/'?'/index.html':decoded));
  if(!filename.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  fs.readFile(filename,(error,data)=>{
    if(error){res.writeHead(error.code==='ENOENT'?404:500);res.end('File unavailable');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data);
  });
});
const port=Number(process.env.PORT||8000);
server.listen(port,'127.0.0.1',()=>console.log('Smart Campus Practice 13 running at http://127.0.0.1:'+port));
