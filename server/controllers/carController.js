const { readData, writeData } = require('../services/jsonStorage');
const { supabase, isSupabaseConfigured } = require('../config/supabase');

/**
 * Format a database record (snake_case) to standard API format (camelCase)
 */
function formatCarRecord(car, sellerData = null) {
  if (!car) return null;
  return {
    id: car.id,
    sellerId: car.seller_id || car.sellerId,
    title: car.title,
    make: car.make,
    model: car.model,
    year: Number(car.year),
    price: Number(car.price),
    mileage: Number(car.mileage || 0),
    fuelType: car.fuel_type || car.fuelType || 'Petrol',
    transmission: car.transmission || 'Automatic',
    condition: car.condition || 'Used',
    location: car.location || '',
    description: car.description || '',
    images: car.images || [],
    status: car.status || 'Available',
    createdAt: car.created_at || car.createdAt,
    updatedAt: car.updated_at || car.updatedAt,
    seller: sellerData || car.seller || null
  };
}

/**
 * Enhanced faceted vehicle search and catalog endpoint
 */
async function getCars(req, res, next) {
  try {
    const {
      keyword,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      minMileage,
      maxMileage,
      fuelType,
      transmission,
      condition,
      make,
      model,
      location,
      status,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);

    // --- SUPABASE DATABASE QUERY ---
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('cars')
        .select('*', { count: 'exact' });

      // 1. Status Filter
      if (status) {
        query = query.ilike('status', status);
      } else {
        query = query.neq('status', 'Deleted');
      }

      // 2. Keyword Search
      if (keyword && keyword.trim()) {
        const q = `%${keyword.trim()}%`;
        query = query.or(`title.ilike.${q},description.ilike.${q},make.ilike.${q},model.ilike.${q},location.ilike.${q}`);
      }

      // 3. Categorical Filters
      if (make && make.trim()) query = query.ilike('make', make.trim());
      if (model && model.trim()) query = query.ilike('model', `%${model.trim()}%`);
      if (fuelType && fuelType.trim()) query = query.ilike('fuel_type', fuelType.trim());
      if (transmission && transmission.trim()) query = query.ilike('transmission', transmission.trim());
      if (condition && condition.trim()) query = query.ilike('condition', condition.trim());
      if (location && location.trim()) query = query.ilike('location', `%${location.trim()}%`);

      // 4. Range Filters
      if (minPrice && !isNaN(minPrice)) query = query.gte('price', Number(minPrice));
      if (maxPrice && !isNaN(maxPrice)) query = query.lte('price', Number(maxPrice));
      if (minYear && !isNaN(minYear)) query = query.gte('year', Number(minYear));
      if (maxYear && !isNaN(maxYear)) query = query.lte('year', Number(maxYear));
      if (minMileage && !isNaN(minMileage)) query = query.gte('mileage', Number(minMileage));
      if (maxMileage && !isNaN(maxMileage)) query = query.lte('mileage', Number(maxMileage));

      // 5. Sorting
      if (sort === 'price_asc') query = query.order('price', { ascending: true });
      else if (sort === 'price_desc') query = query.order('price', { ascending: false });
      else if (sort === 'year_newest') query = query.order('year', { ascending: false });
      else if (sort === 'year_oldest') query = query.order('year', { ascending: true });
      else if (sort === 'mileage_low') query = query.order('mileage', { ascending: true });
      else if (sort === 'mileage_high') query = query.order('mileage', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      // 6. Pagination
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      const formatted = (data || []).map(c => formatCarRecord(c));
      const total = count || 0;
      const totalPages = Math.ceil(total / limitNum) || 1;

      return res.status(200).json({
        success: true,
        cars: formatted,
        pagination: { page: pageNum, limit: limitNum, total, totalPages }
      });
    }

    // --- LOCAL JSON FALLBACK QUERY ---
    let cars = await readData('cars.json');

    if (status) {
      cars = cars.filter(c => c.status && c.status.toLowerCase() === status.toLowerCase());
    } else {
      cars = cars.filter(c => c.status !== 'Deleted');
    }

    if (keyword && keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      cars = cars.filter(c =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.make && c.make.toLowerCase().includes(q)) ||
        (c.model && c.model.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q))
      );
    }

    if (make && make.trim()) cars = cars.filter(c => c.make && c.make.toLowerCase() === make.trim().toLowerCase());
    if (model && model.trim()) cars = cars.filter(c => c.model && c.model.toLowerCase().includes(model.trim().toLowerCase()));
    if (fuelType && fuelType.trim()) cars = cars.filter(c => c.fuelType && c.fuelType.toLowerCase() === fuelType.trim().toLowerCase());
    if (transmission && transmission.trim()) cars = cars.filter(c => c.transmission && c.transmission.toLowerCase() === transmission.trim().toLowerCase());
    if (condition && condition.trim()) cars = cars.filter(c => c.condition && c.condition.toLowerCase() === condition.trim().toLowerCase());
    if (location && location.trim()) cars = cars.filter(c => c.location && c.location.toLowerCase().includes(location.trim().toLowerCase()));

    if (minPrice && !isNaN(minPrice)) cars = cars.filter(c => Number(c.price) >= Number(minPrice));
    if (maxPrice && !isNaN(maxPrice)) cars = cars.filter(c => Number(c.price) <= Number(maxPrice));
    if (minYear && !isNaN(minYear)) cars = cars.filter(c => Number(c.year) >= Number(minYear));
    if (maxYear && !isNaN(maxYear)) cars = cars.filter(c => Number(c.year) <= Number(maxYear));
    if (minMileage && !isNaN(minMileage)) cars = cars.filter(c => Number(c.mileage) >= Number(minMileage));
    if (maxMileage && !isNaN(maxMileage)) cars = cars.filter(c => Number(c.mileage) <= Number(maxMileage));

    if (sort === 'price_asc') cars.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === 'price_desc') cars.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === 'year_newest') cars.sort((a, b) => Number(b.year) - Number(a.year));
    else if (sort === 'year_oldest') cars.sort((a, b) => Number(a.year) - Number(b.year));
    else if (sort === 'mileage_low') cars.sort((a, b) => Number(a.mileage) - Number(b.mileage));
    else if (sort === 'mileage_high') cars.sort((a, b) => Number(b.mileage) - Number(a.mileage));
    else cars.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = cars.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const paginatedCars = cars.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.status(200).json({
      success: true,
      cars: paginatedCars.map(c => formatCarRecord(c)),
      pagination: { page: pageNum, limit: limitNum, total, totalPages }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Fetch a single vehicle with populated seller profile
 */
async function getCarById(req, res, next) {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data: car, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error || !car) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }

      const { data: seller } = await supabase
        .from('users')
        .select('id, name, phone, verified_seller')
        .eq('id', car.seller_id)
        .single();

      const safeSeller = seller ? {
        id: seller.id,
        name: seller.name,
        phone: seller.phone,
        verifiedSeller: seller.verified_seller
      } : null;

      return res.status(200).json({ success: true, car: formatCarRecord(car, safeSeller) });
    }

    const cars = await readData('cars.json');
    const car = cars.find(c => c.id === req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const users = await readData('users.json');
    const seller = users.find(u => u.id === car.sellerId);
    const safeSeller = seller ? {
      id: seller.id,
      name: seller.name,
      phone: seller.phone,
      verifiedSeller: seller.verifiedSeller
    } : null;

    res.status(200).json({ success: true, car: formatCarRecord(car, safeSeller) });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new vehicle listing
 */
async function createCar(req, res, next) {
  try {
    const {
      title,
      make,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      condition,
      location,
      description
    } = req.body;

    if (!title || !make || !model || !year || !price) {
      return res.status(400).json({ success: false, message: 'Required vehicle fields are missing' });
    }

    const imagePaths = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const now = new Date().toISOString();

    const carData = {
      id: `car-${Date.now()}`,
      seller_id: req.user.id,
      title,
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage) || 0,
      fuel_type: fuelType || 'Petrol',
      transmission: transmission || 'Automatic',
      condition: condition || 'Used',
      location: location || '',
      description: description || '',
      images: imagePaths,
      status: 'Available',
      created_at: now,
      updated_at: now
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('cars').insert([carData]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, car: formatCarRecord(data) });
    }

    const cars = await readData('cars.json');
    cars.push(formatCarRecord(carData));
    await writeData('cars.json', cars);

    res.status(201).json({ success: true, car: formatCarRecord(carData) });
  } catch (err) {
    next(err);
  }
}

/**
 * Update an existing vehicle listing
 */
async function updateCar(req, res, next) {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data: existingCar, error: fetchErr } = await supabase
        .from('cars')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (fetchErr || !existingCar) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }

      if (req.user.role !== 'admin' && existingCar.seller_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own listings' });
      }

      const updatedImages = req.files && req.files.length > 0
        ? req.files.map(f => `/uploads/${f.filename}`)
        : existingCar.images;

      const updatePayload = {
        title: req.body.title || existingCar.title,
        make: req.body.make || existingCar.make,
        model: req.body.model || existingCar.model,
        year: req.body.year ? Number(req.body.year) : existingCar.year,
        price: req.body.price ? Number(req.body.price) : existingCar.price,
        mileage: req.body.mileage !== undefined ? Number(req.body.mileage) : existingCar.mileage,
        fuel_type: req.body.fuelType || existingCar.fuel_type,
        transmission: req.body.transmission || existingCar.transmission,
        condition: req.body.condition || existingCar.condition,
        location: req.body.location !== undefined ? req.body.location : existingCar.location,
        description: req.body.description !== undefined ? req.body.description : existingCar.description,
        images: updatedImages,
        updated_at: new Date().toISOString()
      };

      const { data: updated, error: updateErr } = await supabase
        .from('cars')
        .update(updatePayload)
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      return res.status(200).json({ success: true, car: formatCarRecord(updated) });
    }

    const cars = await readData('cars.json');
    const carIndex = cars.findIndex(c => c.id === req.params.id);

    if (carIndex === -1) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (req.user.role !== 'admin' && cars[carIndex].sellerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own listings' });
    }

    const existingCar = cars[carIndex];
    const updatedImages = req.files && req.files.length > 0 
      ? req.files.map(f => `/uploads/${f.filename}`)
      : existingCar.images;

    const updatedCar = {
      ...existingCar,
      ...req.body,
      images: updatedImages,
      year: req.body.year ? Number(req.body.year) : existingCar.year,
      price: req.body.price ? Number(req.body.price) : existingCar.price,
      mileage: req.body.mileage !== undefined ? Number(req.body.mileage) : existingCar.mileage,
      updatedAt: new Date().toISOString()
    };

    cars[carIndex] = updatedCar;
    await writeData('cars.json', cars);

    res.status(200).json({ success: true, car: formatCarRecord(updatedCar) });
  } catch (err) {
    next(err);
  }
}

/**
 * Change listing status (Available, Pending, Sold)
 */
async function updateCarStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['Available', 'Pending', 'Sold'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    if (isSupabaseConfigured && supabase) {
      const { data: car, error: fetchErr } = await supabase.from('cars').select('*').eq('id', req.params.id).single();
      if (fetchErr || !car) return res.status(404).json({ success: false, message: 'Vehicle not found' });

      if (req.user.role !== 'admin' && car.seller_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not own this listing' });
      }

      const { data: updated, error: updateErr } = await supabase
        .from('cars')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      return res.status(200).json({ success: true, car: formatCarRecord(updated) });
    }

    const cars = await readData('cars.json');
    const car = cars.find(c => c.id === req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    if (req.user.role !== 'admin' && car.sellerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this listing' });
    }

    car.status = status;
    car.updatedAt = new Date().toISOString();
    await writeData('cars.json', cars);

    res.status(200).json({ success: true, car: formatCarRecord(car) });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a vehicle listing
 */
async function deleteCar(req, res, next) {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data: car, error: fetchErr } = await supabase.from('cars').select('*').eq('id', req.params.id).single();
      if (fetchErr || !car) return res.status(404).json({ success: false, message: 'Vehicle not found' });

      if (req.user.role !== 'admin' && car.seller_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not own this listing' });
      }

      const { error: delErr } = await supabase.from('cars').delete().eq('id', req.params.id);
      if (delErr) throw delErr;

      return res.status(200).json({ success: true, message: 'Listing deleted successfully' });
    }

    const cars = await readData('cars.json');
    const carIndex = cars.findIndex(c => c.id === req.params.id);

    if (carIndex === -1) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (req.user.role !== 'admin' && cars[carIndex].sellerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this listing' });
    }

    cars.splice(carIndex, 1);
    await writeData('cars.json', cars);

    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Get listings belonging to current seller
 */
async function getSellerListings(req, res, next) {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('seller_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, cars: (data || []).map(c => formatCarRecord(c)) });
    }

    const cars = await readData('cars.json');
    const sellerCars = cars.filter(c => c.sellerId === req.user.id);
    res.status(200).json({ success: true, cars: sellerCars.map(c => formatCarRecord(c)) });
  } catch (err) {
    next(err);
  }
}

/**
 * Compare 2 to 4 vehicles side-by-side
 */
async function compareCars(req, res, next) {
  try {
    const ids = (req.query.ids || '').split(',').map(s => s.trim()).filter(Boolean);
    if (ids.length < 2 || ids.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Comparison requires between 2 and 4 valid vehicle IDs'
      });
    }

    let matchedCars = [];

    if (isSupabaseConfigured && supabase) {
      const { data: cars, error } = await supabase
        .from('cars')
        .select('*')
        .in('id', ids);

      if (error) throw error;

      // Maintain user ID ordering
      matchedCars = ids.map(id => {
        const found = (cars || []).find(c => c.id === id);
        return found ? formatCarRecord(found) : null;
      }).filter(Boolean);
    } else {
      const cars = await readData('cars.json');
      const users = await readData('users.json');

      matchedCars = ids.map(id => {
        const car = cars.find(c => c.id === id);
        if (!car) return null;
        const seller = users.find(u => u.id === car.sellerId);
        return formatCarRecord(car, seller ? { name: seller.name, verifiedSeller: seller.verifiedSeller, phone: seller.phone } : null);
      }).filter(Boolean);
    }

    if (matchedCars.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Could not find enough matching vehicles to compare'
      });
    }

    // Calculate best highlights
    const minPrice = Math.min(...matchedCars.map(c => Number(c.price) || Infinity));
    const minMileage = Math.min(...matchedCars.map(c => Number(c.mileage) || Infinity));
    const maxYear = Math.max(...matchedCars.map(c => Number(c.year) || 0));

    res.status(200).json({
      success: true,
      cars: matchedCars,
      highlights: {
        lowestPrice: minPrice !== Infinity ? minPrice : null,
        lowestMileage: minMileage !== Infinity ? minMileage : null,
        newestYear: maxYear !== 0 ? maxYear : null
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  updateCarStatus,
  deleteCar,
  getSellerListings,
  compareCars
};
