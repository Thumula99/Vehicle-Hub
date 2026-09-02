const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', carController.getCars);
router.get('/compare', carController.compareCars);
router.get('/seller/my-listings', authenticateToken, requireRole('seller', 'admin'), carController.getSellerListings);
router.get('/:id', carController.getCarById);

// Protected seller routes
router.post('/', authenticateToken, requireRole('seller', 'admin'), upload.array('images', 10), carController.createCar);
router.put('/:id', authenticateToken, requireRole('seller', 'admin'), upload.array('images', 10), carController.updateCar);
router.patch('/:id/status', authenticateToken, requireRole('seller', 'admin'), carController.updateCarStatus);
router.delete('/:id', authenticateToken, requireRole('seller', 'admin'), carController.deleteCar);

module.exports = router;
