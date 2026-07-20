import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

// Avoid duplicate subscriptions for the same email AND location
subscriptionSchema.index({ email: 1, location: 1 }, { unique: true });

export default mongoose.model('Subscription', subscriptionSchema);
