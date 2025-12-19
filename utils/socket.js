const io = require('socket.io-client');

let socket = null;
let connected = false;

function getSocket() {
  return socket;
}

function connectSocket(baseURL) {
  try {
    if (!baseURL) {
      console.error('[Socket] Base URL is required to connect');
      return null;
    }
    if (socket && connected) return socket;

    socket = io(baseURL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      connected = true;
      console.log('[Socket] Connected successfully');
    });

    socket.on('disconnect', () => {
      connected = false;
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      connected = false;
    });

    return socket;
  } catch (error) {
    console.error('[Socket] Error setting up connection:', error.message);
    return null;
  }
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    connected = false;
    console.log('[Socket] Disconnected manually');
  }
}

module.exports = {
  getSocket,
  connectSocket,
  disconnectSocket,
};