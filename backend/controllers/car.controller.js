import { Car } from '../models/car.model.js';
import { User } from '../models/user.model.js';

export const createCar = async (req, res) => {
    try {
        const {
            brand,
            model,
            year,
            price,
            mileage,
            transmission,
            fuelType,
            condition,
            location,
            description,
            images
        } = req.body;

 
        if (!brand || !model || !year || !price || !mileage || !transmission || !fuelType || !condition || !location) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        const car = new Car({
            seller: req.userId,
            brand,
            model,
            year,
            price,
            mileage,
            transmission,
            fuelType,
            condition,
            location,
            description,
            images: images || []
        });

        await car.save();
        await car.populate('seller', 'name email');

        res.status(201).json({
            success: true,
            message: 'Car listing created successfully',
            car
        });
    } catch (error) {
        console.log('Error creating car:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all cars with filters and sorting
export const getAllCars = async (req, res) => {
    try {
        const {
            brand,
            model,
            minYear,
            maxYear,
            minPrice,
            maxPrice,
            transmission,
            fuelType,
            condition,
            location,
            sortBy = 'newest',
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = { isSold: false };

        if (brand) filter.brand = new RegExp(brand, 'i');
        if (model) filter.model = new RegExp(model, 'i');
        if (minYear || maxYear) {
            filter.year = {};
            if (minYear) filter.year.$gte = parseInt(minYear);
            if (maxYear) filter.year.$lte = parseInt(maxYear);
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }
        if (transmission) filter.transmission = transmission;
        if (fuelType) filter.fuelType = fuelType;
        if (condition) filter.condition = condition;
        if (location) filter.location = new RegExp(location, 'i');

        // Build sort object
        let sort = {};
        switch (sortBy) {
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'oldest':
                sort = { createdAt: 1 };
                break;
            case 'lowestPrice':
                sort = { price: 1 };
                break;
            case 'highestPrice':
                sort = { price: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const cars = await Car.find(filter)
            .populate('seller', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Car.countDocuments(filter);

        res.status(200).json({
            success: true,
            cars,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalCars: total,
                hasNext: skip + cars.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.log('Error getting cars:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single car by ID
export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;

        const car = await Car.findById(id).populate('seller', 'name email createdAt');

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        res.status(200).json({
            success: true,
            car
        });
    } catch (error) {
        console.log('Error getting car:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update car listing (seller only)
export const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const car = await Car.findById(id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Check if user is the seller
        if (car.seller.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own listings'
            });
        }

        // Don't allow updating if car is sold
        if (car.isSold) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update a sold car'
            });
        }

        // Update allowed fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && key !== 'seller' && key !== 'isSold') {
                car[key] = updateData[key];
            }
        });

        await car.save();
        await car.populate('seller', 'name email');

        res.status(200).json({
            success: true,
            message: 'Car listing updated successfully',
            car
        });
    } catch (error) {
        console.log('Error updating car:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete car listing (seller only)
export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        const car = await Car.findById(id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Check if user is the seller
        if (car.seller.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own listings'
            });
        }

        await Car.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Car listing deleted successfully'
        });
    } catch (error) {
        console.log('Error deleting car:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's cars
export const getUserCars = async (req, res) => {
    try {
        const userId = req.userId;
        const { includeSold = 'false' } = req.query;

        const filter = { seller: userId };
        if (includeSold === 'false') {
            filter.isSold = false;
        }

        const cars = await Car.find(filter)
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            cars
        });
    } catch (error) {
        console.log('Error getting user cars:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get featured cars (random selection)
export const getFeaturedCars = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const cars = await Car.aggregate([
            { $match: { isSold: false } },
            { $sample: { size: limit } }
        ]);

        await Car.populate(cars, { path: 'seller', select: 'name email' });

        res.status(200).json({
            success: true,
            cars
        });
    } catch (error) {
        console.log('Error getting featured cars:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get popular brands
export const getPopularBrands = async (req, res) => {
    try {
        const brands = await Car.aggregate([
            { $match: { isSold: false } },
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            brands: brands.map(b => ({ brand: b._id, count: b.count }))
        });
    } catch (error) {
        console.log('Error getting popular brands:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

