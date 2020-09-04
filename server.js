const http = require('http');
const app = require('./backend/app');

const port = process.env.PORT || 3000;

const onError = error => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port "+port;
    switch (error.code) {
        case "EACCES":
            console.log(bind + " requires higher privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.log(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port "+port;
    console.log('listening on ' + bind); 
}

app.set('port', port);
const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);



