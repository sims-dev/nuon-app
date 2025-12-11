import io from 'socket.io-client';
import { IP_ADDRESS } from '../../config/ipConfig';

let socket = null;
let token = null;
let connected = false;

export function getSocket() {
  return socket;
}

export function connectSocket() {
  if (socket && connected) return socket;
  socket = io(`http://${IP_ADDRESS}:5000`, {
    transports: ['websocket'],
    query: token ? { token } : {},
  });
  connected = true;
  return socket;
}

export function updateToken(newToken) {
  token = newToken;
  if (socket) {
    socket.io.opts.query = { token };
  }
}

export function disconnect() {
  if (socket) socket.disconnect();
  socket = null;
  connected = false;
}

export function on(event, handler) {
  if (!socket) return () => {};
  socket.on(event, handler);
  return () => { try { socket.off(event, handler); } catch {} };
}

export function disconnectSocket() {
  disconnect();
}
