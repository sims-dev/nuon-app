import io from 'socket.io-client';

let socket: any = null;
let connected = false;

export function getSocket() {
  return socket;
}

export function connectSocket() {
  try {
    // For figma ui, use the backend URL
    const base = 'http://localhost:5000'; // Adjust as needed
    if (!base) return null;
    if (socket && connected) return socket;

    socket = io(base, {
      transports: ['websocket'],
      withCredentials: false,
      forceNew: true,
      timeout: 2000,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      connected = true;
      console.log('[Socket] Connected successfully');
    });

    socket.on('disconnect', () => {
      connected = false;
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (error: any) => {
      console.log('[Socket] Connection error:', error.message);
      connected = false;
    });

    socket.on('connect_timeout', () => {
      console.log('[Socket] Connection timeout');
      connected = false;
    });

    return socket;
  } catch (e: any) {
    console.log('[Socket] Connection setup error:', e.message);
    return null;
  }
}

export function on(event: string, handler: Function) {
  if (!socket) return () => {};
  socket.on(event, handler);
  return () => { try { socket.off(event, handler); } catch {} };
}

export function disconnectSocket() {
  try { if (socket) socket.disconnect(); } catch {}
  socket = null; connected = false;
}