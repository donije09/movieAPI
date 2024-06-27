const http = require('http'); 
const fs = require('fs'); 
const url = require('url'); 
const port = 8080; 
http.createServer((request, response) => {
    let parsedUrl = url.parse(request.url, true);
    let path = parsedUrl.pathname; 
    if (path === '/documentation') { 
        fs.readFile('documentation.html', (err, data) => {
            if (err) { 
                response.writeHead(500, {'Content-Type': 'text/plain'}); 
                response.end('Internal Server Error');
            } else{ 
                response.writeHead(200, {'Content-Type': 'text/html'}); 
                response.end(data); 
            } 
        }); 
    } else { 
        fs.readFile('index.html', (err, data) => {
            if (err) { 
                response.writeHead(500, {'Content-Type': 'text/plain'}); 
                response.end('Internal Server Error'); 
           } else { 
                response.writeHead(200, {'Content-Type': 'text/html'}); 
                response.end(data); 
            } 
        }); 
    } 
    fs.appendFile('log.txt', `URL: ${request.url} - Time: ${new Date().toISOString()}\n`, err =>{
        if (err) { 
            console.error(err); 
        } 
    }); 
}).listen(port); 
console.log(`Server running at http://localhost:${port}`); 
