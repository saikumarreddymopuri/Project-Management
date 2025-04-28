import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";

const connectDB = async()=>{
    try {
        console.log(process.env.DATABASE_URI)
        const connectioninstance=await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        console.log(`\n mongodb conncted !! DB HOST:${connectioninstance.connection.host}`)
        console.log(process.env.REGISTRATION_KEY)
        console.log(process.env.JWT_SECRET)
    } catch (error) {
        console.log("mongodb connection error",error);
        process.exit(1)
    }
  }

  export default connectDB
  