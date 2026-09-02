'use client';

import React, { useState } from 'react';
import { Send, User } from 'lucide-react';

export default function ChatWindow({ conversation, messages, onSendMessage, currentUserId }) {
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-8">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{conversation.partner?.name || 'User'}</h3>
            <p className="text-xs text-gray-500">{conversation.car?.title || 'Vehicle'}</p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-sky-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 border border-gray-100 shadow-sm rounded-bl-sm'
                }`}
              >
                <p>{msg.message}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-sky-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
