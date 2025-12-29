import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar,
    getUserCars,
    getFeaturedCars,
    getPopularBrands
} from '../controllers/car.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllCars);
router.get('/featured', getFeaturedCars);
router.get('/popular-brands', getPopularBrands);
router.get('/:id', getCarById);

// Protected routes
router.post('/', verifyToken, createCar);
router.get('/user/my-cars', verifyToken, getUserCars);
router.put('/:id', verifyToken, updateCar);
router.delete('/:id', verifyToken, deleteCar);

export default router;

