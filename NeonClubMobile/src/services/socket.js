import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentBaseURL } from './api';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async connect() {
    try {
      if (this.socket && this.isConnected) {
        return this.socket;
      }

      // Get the current API base URL and remove '/api' suffix
      const apiBase = getCurrentBaseURL();
      const baseUrl = apiBase.replace(/\/api\/?$/, '');

      // Get JWT token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('[SocketService] No JWT token found, skipping connection');
        return null;
      }

      console.log('[SocketService] Connecting to:', baseUrl);

      // Create socket connection with authentication
      this.socket = io(baseUrl, {
        transports: ['websocket'],
        auth: {
          token: token
        },
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        forceNew: true,
      });

      // Set up event listeners
      this.setupEventListeners();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket.on('connect', () => {
          clearTimeout(timeout);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log('[SocketService] Connected successfully');
          resolve(this.socket);
        });

        this.socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          this.isConnected = false;
          console.error('[SocketService] Connection error:', error.message);
          reject(error);
        });
      });

    } catch (error) {
      console.error('[SocketService] Connection setup error:', error);
      return null;
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('[SocketService] Disconnected:', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this.isConnected = true;
      console.log('[SocketService] Reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('[SocketService] Reconnection error:', error.message);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[SocketService] Reconnection failed after', this.maxReconnectAttempts, 'attempts');
    });

    // Authentication events
    this.socket.on('authenticated', (data) => {
      console.log('[SocketService] Authenticated:', data);
    });

    this.socket.on('unauthorized', (error) => {
      console.error('[SocketService] Unauthorized:', error.message);
      this.disconnect();
    });

    // Basic real-time events (can be extended based on app needs)
    this.socket.on('notification', (data) => {
      console.log('[SocketService] New notification:', data);
      // Emit to any registered listeners
      this.emitToListeners('notification', data);
    });

    this.socket.on('booking_update', (data) => {
      console.log('[SocketService] Booking update:', data);
      this.emitToListeners('booking_update', data);
    });

    this.socket.on('mentor_availability_update', (data) => {
      console.log('[SocketService] Mentor availability update:', data);
      this.emitToListeners('mentor_availability_update', data);
    });

    this.socket.on('new_mentor_availability', (data) => {
      console.log('[SocketService] New mentor availability:', data);
      this.emitToListeners('new_mentor_availability', data);
    });
  }

  emitToListeners(event, data) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('[SocketService] Error in event listener:', error);
      }
    });
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);

    // Return cleanup function
    return () => {
      const listeners = this.eventListeners.get(event) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  off(event, callback) {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('[SocketService] Cannot emit, socket not connected');
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('[SocketService] Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
    }
  }

  isSocketConnected() {
    return this.isConnected && this.socket && this.socket.connected;
  }

  // Method to update token (useful when token is refreshed)
  async updateToken(newToken) {
    if (this.socket && this.isConnected) {
      this.socket.auth.token = newToken;
      // Optionally reconnect with new token
      this.disconnect();
      await this.connect();
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;