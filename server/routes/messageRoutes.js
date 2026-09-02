const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/conversations', messageController.getConversations);
router.get('/unread/count', messageController.getUnreadCount);
router.get('/:conversationId', messageController.getConversationMessages);
router.post('/', messageController.sendMessage);
router.put('/:conversationId/read', messageController.markConversationRead);

module.exports = router;
