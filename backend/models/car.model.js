import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    mileage: {
        type: Number,
        required: true,
        min: 0
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual', 'CVT'],
        required: true
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
        required: true
    },
    condition: {
        type: String,
        enum: ['New', 'Used', 'Certified Pre-Owned'],
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    images: [{
        type: String
    }],
    isSold: {
        type: Boolean,
        default: false
    },
    soldAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for search optimization
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });
carSchema.index({ isSold: 1 });

export const Car = mongoose.model('Car', carSchema);

