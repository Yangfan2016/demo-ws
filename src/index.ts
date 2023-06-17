import { createServer } from "http";
import WebSocket from "ws";
import * as fs from "fs";
import * as path from "path";

const wss = new WebSocket.Server({ port: 8080 });
let timer: NodeJS.Timer
let pool: WebSocket[] = [];
wss.addListener('connection', (req) => {
    pool.push(req);
    console.log('ws connection')
    req.addListener('message', (...data) => {
        console.log('ws received', data[0].toString());
        // req.send(`hello [${data}]`);
        pool.forEach(req => {
            req.send(`群发消息 [${data}]`)
        });
    });
})
wss.addListener('close', () => {
    clearInterval(timer)
    console.log('ws close')

})
wss.addListener('error', (err) => {
    clearInterval(timer)
    console.log('ws error', err);
})

// static server
createServer((req, res) => {
    const url = new URL(req.url || '', 'file:///');
    const { pathname } = url;
    if (pathname === '/') {
        fs.createReadStream(path.resolve(process.env.PWD || '', './index.html')).pipe(res);
    } else {
        res.statusCode = 404;
        res.end('404 notfound');
    }
}).listen(3000);

