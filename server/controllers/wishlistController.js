const { readData, writeData } = require('../services/jsonStorage');

async function getWishlist(req, res, next) {
  try {
    const users = await readData('users.json');
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cars = await readData('cars.json');
    const wishlistIds = user.wishlist || [];
    const wishlistCars = cars.filter(c => wishlistIds.includes(c.id));

    res.status(200).json({ success: true, wishlist: wishlistCars, wishlistIds });
  } catch (err) {
    next(err);
  }
}

async function addToWishlist(req, res, next) {
  try {
    const { carId } = req.params;
    const cars = await readData('cars.json');
    const carExists = cars.some(c => c.id === carId);

    if (!carExists) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const users = await readData('users.json');
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.wishlist) user.wishlist = [];
    if (!user.wishlist.includes(carId)) {
      user.wishlist.push(carId);
      user.updatedAt = new Date().toISOString();
      await writeData('users.json', users);
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
}

async function removeFromWishlist(req, res, next) {
  try {
    const { carId } = req.params;
    const users = await readData('users.json');
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.wishlist) {
      user.wishlist = user.wishlist.filter(id => id !== carId);
      user.updatedAt = new Date().toISOString();
      await writeData('users.json', users);
    }

    res.status(200).json({ success: true, wishlist: user.wishlist || [] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
