// Step 1: Test WebSocket connection to Figma MCP relay
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const WS_URL = 'ws://localhost:3055';
const CHANNEL = 'mbatgco6';

const ws = new WebSocket(WS_URL);
const pending = new Map();

function sendCommand(command, params = {}, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const msg = {
      id,
      type: command === 'join' ? 'join' : 'message',
      channel: CHANNEL,
      ...(command === 'join' ? {} : {}),
      message: { id, command, params: { ...params, commandId: id } }
    };
    if (command === 'join') {
      delete msg.message;
    }
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timeout: ${command}`));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
    console.log(`[SEND] ${command}`);
    ws.send(JSON.stringify(msg));
  });
}

ws.on('open', async () => {
  console.log('[OK] Connected to ws://localhost:3055');
  try {
    // Join channel
    const joinId = uuidv4();
    const joinMsg = { id: joinId, type: 'join', channel: CHANNEL };
    const joinTimer = setTimeout(() => { pending.delete(joinId); console.log('[TIMEOUT] join'); process.exit(1); }, 5000);
    pending.set(joinId, { resolve: () => {}, reject: () => {}, timer: joinTimer });
    ws.send(JSON.stringify(joinMsg));
    console.log(`[SEND] join channel: ${CHANNEL}`);

    // Wait a bit for join to complete
    await new Promise(r => setTimeout(r, 2000));

    // Get document info
    const docResult = await sendCommand('get_document_info');
    console.log('[OK] Document info:', JSON.stringify(docResult).substring(0, 300));

    console.log('\n[DONE] Connection test passed!');
    process.exit(0);
  } catch (e) {
    console.error('[ERROR]', e.message);
    process.exit(1);
  }
});

ws.on('message', (data) => {
  try {
    const parsed = JSON.parse(data.toString());
    // console.log('[RECV]', JSON.stringify(parsed).substring(0, 200));
    
    if (parsed.id && pending.has(parsed.id)) {
      const { resolve, timer } = pending.get(parsed.id);
      clearTimeout(timer);
      pending.delete(parsed.id);
      resolve(parsed.message || parsed);
    }
    // Handle responses where the result comes in a different format
    if (parsed.type === 'message' && parsed.message && parsed.message.id && pending.has(parsed.message.id)) {
      const { resolve, timer } = pending.get(parsed.message.id);
      clearTimeout(timer);
      pending.delete(parsed.message.id);
      resolve(parsed.message.result || parsed.message);
    }
  } catch (e) {
    console.error('[PARSE ERROR]', e.message);
  }
});

ws.on('error', (e) => {
  console.error('[WS ERROR]', e.message);
  process.exit(1);
});

ws.on('close', () => {
  console.log('[WS CLOSED]');
});
