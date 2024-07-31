import express from 'express';
import { WebSocketServer } from 'ws';

import { GameMessage } from './constants/messages';
import { messageHandler } from './handlers';

const app = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);

const wss = new WebSocketServer({ noServer: true });

function onUpgradeError(error: Error) {}
function onSocketError(error: Error) {}

server.on('upgrade', (req, socket, head) => {
  socket.on('error', onUpgradeError);

  //perform auth

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener('error', onUpgradeError);
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws, req) => {
  ws.on('error', onSocketError);

  ws.on('message', (msg, isBinary) => {
    const data = JSON.parse(msg.toString()) as GameMessage;
    console.log('received message:', data);
    messageHandler(ws, data);
  });
});
