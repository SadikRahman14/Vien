import mongoose from "mongoose";
import constants from "../constant.js";

const DB_NAME = constants.DB_NAME;


const connectDB = async () => { 
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is required');
        }
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_NAME
        });
        console.log(`\n MongoDB Connected!!! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Error!", error);
        process.exit(1)
    }
}

export default connectDB;