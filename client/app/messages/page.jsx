'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { chatService } from '../../services/chatService';
import ChatWindow from '../../components/chat/ChatWindow';
import { MessageSquare, User, Car } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const { socket, refreshUnreadCount } = useChat();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await chatService.getConversations();
      if (res.success) {
        setConversations(res.conversations);
        if (res.conversations.length > 0 && !activeConv) {
          selectConversation(res.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (socket && activeConv) {
      socket.emit('joinConversation', activeConv.id);

      const handleReceive = (newMsg) => {
        if (newMsg.conversationId === activeConv.id) {
          setMessages(prev => [...prev, newMsg]);
        }
      };

      socket.on('receiveMessage', handleReceive);

      return () => {
        socket.off('receiveMessage', handleReceive);
      };
    }
  }, [socket, activeConv]);

  const selectConversation = async (conv) => {
    setActiveConv(conv);
    try {
      const res = await chatService.getMessages(conv.id);
      if (res.success) {
        setMessages(res.messages);
      }
      await chatService.markAsRead(conv.id);
      refreshUnreadCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!activeConv || !user) return;
    const receiverId = activeConv.buyerId === user.id ? activeConv.sellerId : activeConv.buyerId;

    if (socket) {
      socket.emit('sendMessage', {
        conversationId: activeConv.id,
        senderId: user.id,
        receiverId,
        carId: activeConv.carId,
        message: text
      });
    } else {
      // REST fallback
      const res = await chatService.sendMessage({
        receiverId,
        carId: activeConv.carId,
        message: text
      });
      if (res.success) {
        setMessages(prev => [...prev, res.message]);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[75vh] flex flex-col md:flex-row">
          {/* Left Sidebar: Conversations */}
          <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-2 font-bold text-gray-900">
              <MessageSquare className="w-5 h-5 text-sky-600" />
              <span>Inquiries & Chats</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {loadingConvs ? (
                <div className="p-4 text-center text-xs text-gray-400">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No active conversations found.
                </div>
              ) : (
                conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full text-left p-4 hover:bg-white transition flex items-center space-x-3 ${
                      activeConv?.id === conv.id ? 'bg-white border-l-4 border-sky-600' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex-shrink-0 flex items-center justify-center font-bold text-sky-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 text-sm truncate">{conv.partner?.name || 'User'}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-sky-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.car?.title || 'Vehicle'}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Main Pane: Chat Window */}
          <ChatWindow
            conversation={activeConv}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
