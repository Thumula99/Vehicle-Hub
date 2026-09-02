const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/verify-seller', adminController.verifySeller);
router.get('/stats', adminController.getAdminStats);

module.exports = router;
