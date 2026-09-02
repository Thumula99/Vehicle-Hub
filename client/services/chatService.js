import api from './api';

export const chatService = {
  async getConversations() {
    const res = await api.get('/messages/conversations');
    return res.data;
  },

  async getMessages(conversationId) {
    const res = await api.get(`/messages/${conversationId}`);
    return res.data;
  },

  async sendMessage(data) {
    const res = await api.post('/messages', data);
    return res.data;
  },

  async markAsRead(conversationId) {
    const res = await api.put(`/messages/${conversationId}/read`);
    return res.data;
  },

  async getUnreadCount() {
    const res = await api.get('/messages/unread/count');
    return res.data;
  }
};
