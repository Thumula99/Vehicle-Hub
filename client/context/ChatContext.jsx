'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { chatService } from '../services/chatService';

const ChatContext = createContext();

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const socketInstance = io(SOCKET_URL);
      setSocket(socketInstance);

      socketInstance.emit('registerUser', user.id);

      socketInstance.on('newNotification', () => {
        setUnreadCount(prev => prev + 1);
      });

      // Fetch initial unread count
      chatService.getUnreadCount()
        .then(res => {
          if (res.success) setUnreadCount(res.unreadCount);
        })
        .catch(console.error);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user?.id]);

  const refreshUnreadCount = async () => {
    if (isAuthenticated) {
      try {
        const res = await chatService.getUnreadCount();
        if (res.success) setUnreadCount(res.unreadCount);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <ChatContext.Provider value={{
      socket,
      unreadCount,
      refreshUnreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
