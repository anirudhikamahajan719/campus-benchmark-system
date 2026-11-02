import { WebSocketServer, WebSocket } from 'ws';

let wss = null;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    // Send initial handshake
    ws.send(JSON.stringify({
      type: 'CONNECTION_ESTABLISHED',
      message: 'Connected to Campus Benchmark Live Event Stream',
      timestamp: new Date().toISOString()
    }));

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
        }
      } catch (err) {
        console.error('WS Message parsing error:', err);
      }
    });

    ws.on('close', () => {
      // client disconnected
    });
  });

  return wss;
}

export function broadcastMessage(payload) {
  if (!wss) return;
  const messageStr = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(messageStr);
      } catch (err) {
        console.error('Failed to broadcast to client:', err);
      }
    }
  });
}
