const { readData, writeData } = require('../services/jsonStorage');
const { supabase, isSupabaseConfigured } = require('../config/supabase');

/**
 * Fetch populated wishlist vehicles for the authenticated user
 */
async function getWishlist(req, res, next) {
  try {
    const userId = req.user.id;

    if (isSupabaseConfigured && supabase) {
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('wishlist')
        .eq('id', userId)
        .single();

      if (userErr || !user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const wishlistIds = user.wishlist || [];
      if (wishlistIds.length === 0) {
        return res.status(200).json({ success: true, wishlist: [], wishlistIds: [] });
      }

      const { data: cars, error: carsErr } = await supabase
        .from('cars')
        .select('*')
        .in('id', wishlistIds)
        .neq('status', 'Deleted');

      if (carsErr) throw carsErr;

      const validWishlistCars = (cars || []).map(car => ({
        id: car.id,
        sellerId: car.seller_id,
        title: car.title,
        make: car.make,
        model: car.model,
        year: Number(car.year),
        price: Number(car.price),
        mileage: Number(car.mileage || 0),
        fuelType: car.fuel_type || 'Petrol',
        transmission: car.transmission || 'Automatic',
        condition: car.condition || 'Used',
        location: car.location || '',
        description: car.description || '',
        images: car.images || [],
        status: car.status || 'Available',
        createdAt: car.created_at
      }));

      const validIds = validWishlistCars.map(c => c.id);

      // Clean up orphaned IDs in Supabase if any car was deleted
      if (validIds.length !== wishlistIds.length) {
        await supabase.from('users').update({ wishlist: validIds }).eq('id', userId);
      }

      return res.status(200).json({
        success: true,
        wishlist: validWishlistCars,
        wishlistIds: validIds
      });
    }

    // Local JSON Fallback
    const users = await readData('users.json');
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cars = await readData('cars.json');
    const rawWishlistIds = user.wishlist || [];

    const validWishlistCars = [];
    const validWishlistIds = [];

    for (const carId of rawWishlistIds) {
      const car = cars.find(c => c.id === carId && c.status !== 'Deleted');
      if (car) {
        validWishlistCars.push(car);
        validWishlistIds.push(carId);
      }
    }

    if (validWishlistIds.length !== rawWishlistIds.length) {
      user.wishlist = validWishlistIds;
      user.updatedAt = new Date().toISOString();
      await writeData('users.json', users);
    }

    res.status(200).json({
      success: true,
      wishlist: validWishlistCars,
      wishlistIds: validWishlistIds
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Add a vehicle to the authenticated user's wishlist
 */
async function addToWishlist(req, res, next) {
  try {
    const { carId } = req.params;
    const userId = req.user.id;

    if (isSupabaseConfigured && supabase) {
      const { data: car, error: carErr } = await supabase
        .from('cars')
        .select('id, status')
        .eq('id', carId)
        .single();

      if (carErr || !car || car.status === 'Deleted') {
        return res.status(404).json({ success: false, message: 'Vehicle not found or no longer available' });
      }

      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('wishlist')
        .eq('id', userId)
        .single();

      if (userErr || !user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const wishlist = user.wishlist || [];
      if (!wishlist.includes(carId)) {
        wishlist.push(carId);
        const { error: updateErr } = await supabase
          .from('users')
          .update({ wishlist, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (updateErr) throw updateErr;
      }

      return res.status(200).json({
        success: true,
        message: 'Vehicle added to wishlist',
        wishlist
      });
    }

    // Local JSON Fallback
    const cars = await readData('cars.json');
    const car = cars.find(c => c.id === carId && c.status !== 'Deleted');

    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehicle not found or no longer available' });
    }

    const users = await readData('users.json');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!users[userIndex].wishlist) {
      users[userIndex].wishlist = [];
    }

    if (!users[userIndex].wishlist.includes(carId)) {
      users[userIndex].wishlist.push(carId);
      users[userIndex].updatedAt = new Date().toISOString();
      await writeData('users.json', users);
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle added to wishlist',
      wishlist: users[userIndex].wishlist
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Remove a vehicle from the authenticated user's wishlist
 */
async function removeFromWishlist(req, res, next) {
  try {
    const { carId } = req.params;
    const userId = req.user.id;

    if (isSupabaseConfigured && supabase) {
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('wishlist')
        .eq('id', userId)
        .single();

      if (userErr || !user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const wishlist = (user.wishlist || []).filter(id => id !== carId);
      const { error: updateErr } = await supabase
        .from('users')
        .update({ wishlist, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateErr) throw updateErr;

      return res.status(200).json({
        success: true,
        message: 'Vehicle removed from wishlist',
        wishlist
      });
    }

    // Local JSON Fallback
    const users = await readData('users.json');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (users[userIndex].wishlist) {
      users[userIndex].wishlist = users[userIndex].wishlist.filter(id => id !== carId);
      users[userIndex].updatedAt = new Date().toISOString();
      await writeData('users.json', users);
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle removed from wishlist',
      wishlist: users[userIndex].wishlist || []
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
