const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      fs.writeFileSync('C:/Users/santi/AppData/Local/Temp/opencode/figma-variables.json', body, 'utf-8');
      const parsed = JSON.parse(body);
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ok:true}));
      console.log('SAVED: ' + parsed.variables?.length + ' vars, ' + parsed.variableCollections?.length + ' colls');
      setTimeout(() => { server.close(); process.exit(0); }, 1000);
    });
  } else {
    res.writeHead(200);
    res.end('ready');
  }
});
server.listen(3456, '127.0.0.1', () => { console.log('READY on 3456'); });
setTimeout(() => { server.close(); process.exit(1); }, 60000);
