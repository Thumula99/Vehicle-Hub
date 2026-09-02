const { readData, writeData } = require('../services/jsonStorage');

async function getAllUsers(req, res, next) {
  try {
    const users = await readData('users.json');
    const safeUsers = users.map(({ passwordHash, ...safe }) => safe);
    res.status(200).json({ success: true, users: safeUsers });
  } catch (err) {
    next(err);
  }
}

async function verifySeller(req, res, next) {
  try {
    const { id } = req.params;
    const { verifiedSeller } = req.body;

    const users = await readData('users.json');
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verifiedSeller = Boolean(verifiedSeller);
    user.updatedAt = new Date().toISOString();
    await writeData('users.json', users);

    const { passwordHash: _, ...safeUser } = user;
    res.status(200).json({ success: true, user: safeUser });
  } catch (err) {
    next(err);
  }
}

async function getAdminStats(req, res, next) {
  try {
    const users = await readData('users.json');
    const cars = await readData('cars.json');
    const messages = await readData('messages.json');

    const stats = {
      totalUsers: users.length,
      buyers: users.filter(u => u.role === 'buyer').length,
      sellers: users.filter(u => u.role === 'seller').length,
      verifiedSellers: users.filter(u => u.verifiedSeller).length,
      totalListings: cars.length,
      availableListings: cars.filter(c => c.status === 'Available').length,
      soldListings: cars.filter(c => c.status === 'Sold').length,
      totalMessages: messages.length
    };

    res.status(200).json({ success: true, stats });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers,
  verifySeller,
  getAdminStats
};
