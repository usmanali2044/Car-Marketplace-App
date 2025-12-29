import mongoose from 'mongoose';

const buyRequestSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    message: {
        type: String,
        trim: true
    },
    respondedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for efficient queries
buyRequestSchema.index({ seller: 1, status: 1 });
buyRequestSchema.index({ buyer: 1 });
buyRequestSchema.index({ car: 1 });

export const BuyRequest = mongoose.model('BuyRequest', buyRequestSchema);

