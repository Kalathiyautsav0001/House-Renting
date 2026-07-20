import mongoose from 'mongoose';
import House from './models/House.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const houses = await House.find({ $or: [{ latitude: { $exists: false } }, { latitude: null }] });
        console.log(`Found ${houses.length} houses without coordinates.`);

        const center = { lat: 21.1702, lng: 72.8311 }; // Surat center

        for (const house of houses) {
            // Random offset around center
            const latOffset = (Math.random() - 0.5) * 0.05;
            const lngOffset = (Math.random() - 0.5) * 0.05;
            
            house.latitude = center.lat + latOffset;
            house.longitude = center.lng + lngOffset;
            await house.save();
            console.log(`Updated house: ${house.title}`);
        }

        console.log("Migration completed.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

migrate();
