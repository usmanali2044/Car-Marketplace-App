import { BuyRequest } from '../models/buyRequest.model.js';
import { Car } from '../models/car.model.js';
import { sendBuyRequestEmail, sendBuyRequestAcceptedEmail, sendBuyRequestDeclinedEmail } from '../mailtrap/emails.js';


export const createBuyRequest = async (req, res) => {
    try {
        const { carId, message } = req.body;
        const buyerId = req.userId;

        if (!carId) {
            return res.status(400).json({
                success: false,
                message: 'Car ID is required'
            });
        }

        
        const car = await Car.findById(carId).populate('seller', 'name email');
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        if (car.isSold) {
            return res.status(400).json({
                success: false,
                message: 'This car has already been sold'
            });
        }

        // Check if user is trying to buy their own car
        if (car.seller._id.toString() === buyerId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot buy your own car'
            });
        }

        // Check if there's already a pending request from this buyer
        const existingRequest = await BuyRequest.findOne({
            car: carId,
            buyer: buyerId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending request for this car'
            });
        }

        const buyRequest = new BuyRequest({
            car: carId,
            buyer: buyerId,
            seller: car.seller._id,
            message
        });

        await buyRequest.save();
        await buyRequest.populate('buyer', 'name email');
        await buyRequest.populate('car', 'brand model year price');

        // Send email notification to seller
        await sendBuyRequestEmail(car.seller.email, buyRequest.buyer.name, car.brand, car.model);

        res.status(201).json({
            success: true,
            message: 'Buy request sent successfully',
            buyRequest
        });
    } catch (error) {
        console.log('Error creating buy request:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get buy requests for seller
export const getSellerRequests = async (req, res) => {
    try {
        const sellerId = req.userId;
        const { status } = req.query;

        const filter = { seller: sellerId };
        if (status) {
            filter.status = status;
        }

        const requests = await BuyRequest.find(filter)
            .populate('buyer', 'name email')
            .populate('car', 'brand model year price images')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.log('Error getting seller requests:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get buy requests for buyer
export const getBuyerRequests = async (req, res) => {
    try {
        const buyerId = req.userId;
        const { status } = req.query;

        const filter = { buyer: buyerId };
        if (status) {
            filter.status = status;
        }

        const requests = await BuyRequest.find(filter)
            .populate('seller', 'name email')
            .populate('car', 'brand model year price images')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.log('Error getting buyer requests:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Accept buy request (seller only)
export const acceptBuyRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const sellerId = req.userId;

        const buyRequest = await BuyRequest.findById(requestId)
            .populate('buyer', 'name email')
            .populate('car', 'brand model year price seller');

        if (!buyRequest) {
            return res.status(404).json({
                success: false,
                message: 'Buy request not found'
            });
        }

        // Check if user is the seller
        if (buyRequest.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only accept requests for your own cars'
            });
        }

        if (buyRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This request has already been responded to'
            });
        }

        // Mark car as sold
        const car = await Car.findById(buyRequest.car._id);
        if (car.isSold) {
            return res.status(400).json({
                success: false,
                message: 'This car has already been sold'
            });
        }

        car.isSold = true;
        car.soldAt = new Date();
        await car.save();

        // Update buy request
        buyRequest.status = 'accepted';
        buyRequest.respondedAt = new Date();
        await buyRequest.save();

        // Decline all other pending requests for this car
        await BuyRequest.updateMany(
            {
                car: buyRequest.car._id,
                _id: { $ne: requestId },
                status: 'pending'
            },
            {
                status: 'declined',
                respondedAt: new Date()
            }
        );

        // Send email notification to buyer
        await sendBuyRequestAcceptedEmail(
            buyRequest.buyer.email,
            buyRequest.buyer.name,
            car.brand,
            car.model
        );

        res.status(200).json({
            success: true,
            message: 'Buy request accepted. Car marked as sold.',
            buyRequest
        });
    } catch (error) {
        console.log('Error accepting buy request:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Decline buy request (seller only)
export const declineBuyRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const sellerId = req.userId;

        const buyRequest = await BuyRequest.findById(requestId)
            .populate('buyer', 'name email')
            .populate('car', 'brand model year');

        if (!buyRequest) {
            return res.status(404).json({
                success: false,
                message: 'Buy request not found'
            });
        }

        // Check if user is the seller
        if (buyRequest.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only decline requests for your own cars'
            });
        }

        if (buyRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This request has already been responded to'
            });
        }

        buyRequest.status = 'declined';
        buyRequest.respondedAt = new Date();
        await buyRequest.save();

        // Send email notification to buyer
        await sendBuyRequestDeclinedEmail(
            buyRequest.buyer.email,
            buyRequest.buyer.name,
            buyRequest.car.brand,
            buyRequest.car.model
        );

        res.status(200).json({
            success: true,
            message: 'Buy request declined',
            buyRequest
        });
    } catch (error) {
        console.log('Error declining buy request:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

