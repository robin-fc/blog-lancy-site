// Step 1b: Test WebSocket - debug response format
const WebSocket = require('ws');
const CHANNEL = 'mbatgco6';

const ws = new WebSocket('ws://localhost:3055');

ws.on('open', () => {
  console.log('[OK] Connected');
  // Send join
  ws.send(JSON.stringify({ id: 'join-1', type: 'join', channel: CHANNEL }));
  console.log('[SEND] join');

  // After 2s, try get_document_info
  setTimeout(() => {
    const cmdId = 'cmd-docinfo-1';
    ws.send(JSON.stringify({
      id: cmdId,
      type: 'message',
      channel: CHANNEL,
      message: { id: cmdId, command: 'get_document_info', params: { commandId: cmdId } }
    }));
    console.log('[SEND] get_document_info');
  }, 2000);
});

ws.on('message', (data) => {
  const raw = data.toString();
  console.log('[RECV RAW]', raw.substring(0, 500));
  console.log('---');
});

ws.on('error', (e) => console.error('[ERROR]', e.message));

// Auto exit after 8s
setTimeout(() => { console.log('[TIMEOUT] Exiting'); process.exit(0); }, 8000);
