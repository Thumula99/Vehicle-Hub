const { readData, writeData } = require('../services/jsonStorage');

async function getConversations(req, res, next) {
  try {
    const userId = req.user.id;
    const conversations = await readData('conversations.json');
    const userConvs = conversations.filter(c => c.buyerId === userId || c.sellerId === userId);

    const users = await readData('users.json');
    const cars = await readData('cars.json');
    const messages = await readData('messages.json');

    const populated = userConvs.map(conv => {
      const otherUserId = conv.buyerId === userId ? conv.sellerId : conv.buyerId;
      const otherUser = users.find(u => u.id === otherUserId);
      const car = cars.find(c => c.id === conv.carId);
      const unreadCount = messages.filter(
        m => m.conversationId === conv.id && m.receiverId === userId && !m.read
      ).length;

      return {
        ...conv,
        partner: otherUser ? { id: otherUser.id, name: otherUser.name, role: otherUser.role } : null,
        car: car ? { id: car.id, title: car.title, price: car.price, image: car.images[0] || null } : null,
        unreadCount
      };
    });

    res.status(200).json({ success: true, conversations: populated });
  } catch (err) {
    next(err);
  }
}

async function getConversationMessages(req, res, next) {
  try {
    const { conversationId } = req.params;
    const conversations = await readData('conversations.json');
    const conv = conversations.find(c => c.id === conversationId);

    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (conv.buyerId !== req.user.id && conv.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: You are not part of this conversation' });
    }

    const messages = await readData('messages.json');
    const convMessages = messages.filter(m => m.conversationId === conversationId);

    res.status(200).json({ success: true, messages: convMessages });
  } catch (err) {
    next(err);
  }
}

async function sendMessage(req, res, next) {
  try {
    const { receiverId, carId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !carId || !message) {
      return res.status(400).json({ success: false, message: 'receiverId, carId, and message are required' });
    }

    const conversations = await readData('conversations.json');
    let conv = conversations.find(
      c => c.carId === carId &&
        ((c.buyerId === senderId && c.sellerId === receiverId) ||
         (c.buyerId === receiverId && c.sellerId === senderId))
    );

    const now = new Date().toISOString();

    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        carId,
        buyerId: senderId,
        sellerId: receiverId,
        lastMessage: message,
        lastMessageAt: now,
        createdAt: now
      };
      conversations.push(conv);
    } else {
      conv.lastMessage = message;
      conv.lastMessageAt = now;
    }
    await writeData('conversations.json', conversations);

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      senderId,
      receiverId,
      carId,
      message,
      read: false,
      createdAt: now
    };

    const messages = await readData('messages.json');
    messages.push(newMessage);
    await writeData('messages.json', messages);

    res.status(201).json({ success: true, message: newMessage, conversationId: conv.id });
  } catch (err) {
    next(err);
  }
}

async function markConversationRead(req, res, next) {
  try {
    const { conversationId } = req.params;
    const messages = await readData('messages.json');

    let updated = false;
    messages.forEach(m => {
      if (m.conversationId === conversationId && m.receiverId === req.user.id && !m.read) {
        m.read = true;
        updated = true;
      }
    });

    if (updated) {
      await writeData('messages.json', messages);
    }

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
}

async function getUnreadCount(req, res, next) {
  try {
    const messages = await readData('messages.json');
    const count = messages.filter(m => m.receiverId === req.user.id && !m.read).length;
    res.status(200).json({ success: true, unreadCount: count });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getConversations,
  getConversationMessages,
  sendMessage,
  markConversationRead,
  getUnreadCount
};
