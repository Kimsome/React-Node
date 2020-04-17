const http = require('http');
const path = require('path');
const fs = require('fs');

const mime = require('./helper/mime');

const server = http.createServer();

server.on('request', (req, res) => {
    const filePath = path.join(__dirname, 'view', path.normalize(req.url));
    // console.log(filePath);
    const contentType = mime(filePath);
    // console.log(contentType);

    if (path.extname(req.url) != '' && fs.existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': contentType });
        content = fs.readFileSync(filePath);
    } else {
        res.writeHead(404, { 'Content-Type': contentType });
        content = "文件不存在";
    }

    res.write(content);
    res.end();
})

server.listen(9000);