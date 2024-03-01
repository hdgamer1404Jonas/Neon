import ws from 'ws';

let server: ws.Server;

export function startWebsocketServer() {
    server = new ws.Server({ noServer: true });
    
    console.log('Websocket server started');

    server.on('connection', (socket) => {
        socket.on('message', (message) => {
            console.log('received: %s', message);
        });
    });
}

export async function broadcast(message: string) {
    server.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(message);
        }
    });
}