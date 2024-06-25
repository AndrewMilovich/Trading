require('dotenv').config();
const WebSocket = require('ws');
const { getMasterTradeDetails, getConnectionID, replicateTrade } = require('./api');
const { handleError } = require('./utils');

const server = new WebSocket.Server({ port: process.env.PORT || 8080 });

server.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', async message => {
        console.log(`Received: ${message}`);
        if (message.toString() === 'trade') {
            try {
                const tradeDetails = await getMasterTradeDetails();

                const connectionID = await getConnectionID();

                const replicationResult = await replicateTrade(tradeDetails, connectionID);

                ws.send(JSON.stringify(replicationResult));
            } catch (error) {
                handleError(error, ws);
            }
        }else{
            console.log(`Get unknown message: ${message}`);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server is running on port ${process.env.PORT || 8080 }`);
