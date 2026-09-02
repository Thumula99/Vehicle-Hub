const { readData, writeData } = require('../services/jsonStorage');

function setupChatSocket(io) {
  const activeUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log('[Socket] Client connected:', socket.id);

    // Register user
    socket.on('registerUser', (userId) => {
      if (userId) {
        activeUsers.set(userId, socket.id);
        console.log(`[Socket] User ${userId} registered to socket ${socket.id}`);
      }
    });

    // Join room for specific conversation
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`[Socket] Socket ${socket.id} joined conversation room: ${conversationId}`);
    });

    // Send real-time message
    socket.on('sendMessage', async (data) => {
      try {
        const { conversationId, senderId, receiverId, carId, message } = data;
        const now = new Date().toISOString();

        const newMessage = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId,
          receiverId,
          carId,
          message,
          read: false,
          createdAt: now
        };

        // Persist message
        const messages = await readData('messages.json');
        messages.push(newMessage);
        await writeData('messages.json', messages);

        // Update conversation
        const conversations = await readData('conversations.json');
        const convIndex = conversations.findIndex(c => c.id === conversationId);
        if (convIndex !== -1) {
          conversations[convIndex].lastMessage = message;
          conversations[convIndex].lastMessageAt = now;
          await writeData('conversations.json', conversations);
        }

        // Emit to room
        io.to(conversationId).emit('receiveMessage', newMessage);

        // If recipient is active, notify them
        const receiverSocketId = activeUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newNotification', {
            type: 'chat',
            title: 'New Message',
            message: `You received a message: "${message.substring(0, 30)}..."`,
            conversationId
          });
        }
      } catch (err) {
        console.error('[Socket Error] sendMessage failed:', err);
      }
    });

    // Typing indicators
    socket.on('typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('userTyping', { userId });
    });

    socket.on('stopTyping', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('userStoppedTyping', { userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      for (const [userId, sockId] of activeUsers.entries()) {
        if (sockId === socket.id) {
          activeUsers.delete(userId);
          console.log(`[Socket] User ${userId} disconnected`);
          break;
        }
      }
    });
  });
}

module.exports = setupChatSocket;
