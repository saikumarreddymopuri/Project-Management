import express from "express";
import dotenv  from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js"
import phaseRoutes from "./routes/phaseRoutes.js"
import projectRoutes from "./routes/projectRoutes .js"
import { notFound,errorHandler } from "./middleware/error.middleware.js";
import cors from "cors";
dotenv.config();

const app =express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:true
}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.json());
console.log("hi")
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/phases', phaseRoutes);

app.use(notFound);
app.use(errorHandler);


export{app}