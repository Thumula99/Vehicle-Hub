const { readData, writeData } = require('../services/jsonStorage');

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
      make,
      model,
      location,
      status,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    let cars = await readData('cars.json');

    // Filtering
    if (status) {
      cars = cars.filter(c => c.status && c.status.toLowerCase() === status.toLowerCase());
    } else {
      cars = cars.filter(c => c.status !== 'Deleted');
    }

    if (keyword) {
      const q = keyword.toLowerCase();
      cars = cars.filter(c =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.make && c.make.toLowerCase().includes(q)) ||
        (c.model && c.model.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q))
      );
    }

    if (make) cars = cars.filter(c => c.make && c.make.toLowerCase() === make.toLowerCase());
    if (model) cars = cars.filter(c => c.model && c.model.toLowerCase() === model.toLowerCase());
    if (fuelType) cars = cars.filter(c => c.fuelType && c.fuelType.toLowerCase() === fuelType.toLowerCase());
    if (transmission) cars = cars.filter(c => c.transmission && c.transmission.toLowerCase() === transmission.toLowerCase());
    if (location) cars = cars.filter(c => c.location && c.location.toLowerCase().includes(location.toLowerCase()));

    if (minPrice) cars = cars.filter(c => Number(c.price) >= Number(minPrice));
    if (maxPrice) cars = cars.filter(c => Number(c.price) <= Number(maxPrice));
    if (minYear) cars = cars.filter(c => Number(c.year) >= Number(minYear));
    if (maxYear) cars = cars.filter(c => Number(c.year) <= Number(maxYear));
    if (minMileage) cars = cars.filter(c => Number(c.mileage) >= Number(minMileage));
    if (maxMileage) cars = cars.filter(c => Number(c.mileage) <= Number(maxMileage));

    // Sorting
    if (sort === 'price_asc') cars.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === 'price_desc') cars.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === 'year_newest') cars.sort((a, b) => Number(b.year) - Number(a.year));
    else if (sort === 'year_oldest') cars.sort((a, b) => Number(a.year) - Number(b.year));
    else if (sort === 'mileage_low') cars.sort((a, b) => Number(a.mileage) - Number(b.mileage));
    else cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const total = cars.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const paginatedCars = cars.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.status(200).json({
      success: true,
      cars: paginatedCars,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getCarById(req, res, next) {
  try {
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

    res.status(200).json({ success: true, car: { ...car, seller: safeSeller } });
  } catch (err) {
    next(err);
  }
}

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

    const newCar = {
      id: `car-${Date.now()}`,
      sellerId: req.user.id,
      title,
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage) || 0,
      fuelType: fuelType || 'Petrol',
      transmission: transmission || 'Automatic',
      condition: condition || 'Used',
      location: location || '',
      description: description || '',
      images: imagePaths,
      status: 'Available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const cars = await readData('cars.json');
    cars.push(newCar);
    await writeData('cars.json', cars);

    res.status(201).json({ success: true, car: newCar });
  } catch (err) {
    next(err);
  }
}

async function updateCar(req, res, next) {
  try {
    const cars = await readData('cars.json');
    const carIndex = cars.findIndex(c => c.id === req.params.id);

    if (carIndex === -1) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Check ownership unless admin
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
      mileage: req.body.mileage ? Number(req.body.mileage) : existingCar.mileage,
      updatedAt: new Date().toISOString()
    };

    cars[carIndex] = updatedCar;
    await writeData('cars.json', cars);

    res.status(200).json({ success: true, car: updatedCar });
  } catch (err) {
    next(err);
  }
}

async function updateCarStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['Available', 'Pending', 'Sold'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const cars = await readData('cars.json');
    const car = cars.find(c => c.id === req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (req.user.role !== 'admin' && car.sellerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this listing' });
    }

    car.status = status;
    car.updatedAt = new Date().toISOString();
    await writeData('cars.json', cars);

    res.status(200).json({ success: true, car });
  } catch (err) {
    next(err);
  }
}

async function deleteCar(req, res, next) {
  try {
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

async function getSellerListings(req, res, next) {
  try {
    const cars = await readData('cars.json');
    const sellerCars = cars.filter(c => c.sellerId === req.user.id);
    res.status(200).json({ success: true, cars: sellerCars });
  } catch (err) {
    next(err);
  }
}

async function compareCars(req, res, next) {
  try {
    const ids = (req.query.ids || '').split(',').filter(Boolean);
    if (ids.length < 2 || ids.length > 4) {
      return res.status(400).json({ success: false, message: 'Provide between 2 and 4 valid vehicle IDs for comparison' });
    }

    const cars = await readData('cars.json');
    const matched = cars.filter(c => ids.includes(c.id));
    res.status(200).json({ success: true, cars: matched });
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
