const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const wishlistController = require('../controllers/wishlistController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Profile routes
router.get('/me', authenticateToken, authController.getMe);
router.put('/me', authenticateToken, authController.updateProfile);
router.put('/me/password', authenticateToken, authController.changePassword);

// Wishlist routes
router.get('/me/wishlist', authenticateToken, wishlistController.getWishlist);
router.post('/me/wishlist/:carId', authenticateToken, wishlistController.addToWishlist);
router.delete('/me/wishlist/:carId', authenticateToken, wishlistController.removeFromWishlist);

module.exports = router;
