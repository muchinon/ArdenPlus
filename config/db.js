import mongoose from "mongoose"

const mongoUri = process.env.MONGO_URL

export const dbConnection = async () => {
    await mongoose.connect(mongoUri);
    console.log('The Monster is  alive');
}