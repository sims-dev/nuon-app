import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { IP_ADDRESS } from './config/ipConfig';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, isAuthenticated, token }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && token && !socketRef.current) {
      // Connect to socket server
      const newSocket = io(`http://${IP_ADDRESS}:5000`, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Join mentor room if user is a mentor
      newSocket.on('user_authenticated', (user) => {
        if (user.role === 'mentor') {
          newSocket.emit('join_mentor_room', user.id);
        }
      });

    } else if (!isAuthenticated && socketRef.current) {
      // Disconnect socket when user logs out
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [isAuthenticated, token]);

  const value = {
    socket,
    isConnected,
    emit: (event, data) => {
      if (socket && isConnected) {
        socket.emit(event, data);
      }
    },
    on: (event, callback) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    off: (event, callback) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    // Helper methods for admin-mentor messaging
    sendAdminMessage: (mentorId, message) => {
      if (socket && isConnected) {
        socket.emit('send_admin_message', { mentorId, message });
      }
    },
    sendMentorMessage: (adminId, message) => {
      if (socket && isConnected) {
        socket.emit('send_mentor_message', { adminId, message });
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};