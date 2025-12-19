// Lightweight socket.io client wrapper with auto URL from API base
// Use the bundled build to avoid engine.io ESM node-specific imports in React Native
import io from 'socket.io-client/dist/socket.io.js';
import { getCurrentBaseURL } from '../services/api';

let socket = null;
let connected = false;

export function getSocket() {
  return socket;
}

export function connectSocket() {
  try {
    const apiBase = getCurrentBaseURL(); // e.g. http://host:5001/api
    const base = (apiBase || '').replace(/\/?api\/?$/, ''); // -> http://host:5001
    if (!base) return null;
    if (socket && connected) return socket;

    // Add timeout and reconnection options to prevent hanging connections
    socket = io(base, {
      transports: ['websocket'],
      withCredentials: false,
      forceNew: true,
      timeout: 10000, // 10 second connection timeout
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      maxReconnectionAttempts: 3
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
      console.log('[Socket] Connection error:', error.message);
      connected = false;
    });

    socket.on('connect_timeout', () => {
      console.log('[Socket] Connection timeout');
      connected = false;
    });

    return socket;
  } catch (e) {
    console.log('[Socket] Connection setup error:', e.message);
    return null;
  }
}

export function on(event, handler) {
  if (!socket) return () => {};
  socket.on(event, handler);
  return () => { try { socket.off(event, handler); } catch {} };
}

export function disconnectSocket() {
  try { if (socket) socket.disconnect(); } catch {}
  socket = null; connected = false;
}
