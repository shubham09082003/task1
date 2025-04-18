import mongoose from 'mongoose';

export const db = async() => {
    mongoose.connect("mongodb://localhost:27017/");
}
