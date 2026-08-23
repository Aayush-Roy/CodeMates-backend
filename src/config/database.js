// ar0671362_db_user
// ACMHLTe8EtE0h4jR
// mongodb+srv://ar0671362_db_user:ACMHLTe8EtE0h4jR@cluster0.4lgljnr.mongodb.net/
import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://ar0671362_db_user:ACMHLTe8EtE0h4jR@cluster0.4lgljnr.mongodb.net/")
}