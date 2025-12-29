import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    createBuyRequest,
    getSellerRequests,
    getBuyerRequests,
    acceptBuyRequest,
    declineBuyRequest
} from '../controllers/buyRequest.controller.js';

const router = express.Router();

// All routes require authentication
router.post('/', verifyToken, createBuyRequest);
router.get('/seller', verifyToken, getSellerRequests);
router.get('/buyer', verifyToken, getBuyerRequests);
router.put('/:requestId/accept', verifyToken, acceptBuyRequest);
router.put('/:requestId/decline', verifyToken, declineBuyRequest);

export default router;

