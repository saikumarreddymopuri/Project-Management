import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import http from "http";
import { registerUser } from "./controllers/usercontroller.js";
import { app } from "./app.js";
import { Server as SocketIOServer } from "socket.io";
import { getUnreadNotifications,createNotification,marknotificationsread } from "./utils/notificationutil.js";
import { Notification } from "./models/notification.js";
dotenv.config({
    path:'./env'
})
const server = http.createServer(app);
    
    // Initialize Socket.IO with the server
    const io = new SocketIOServer(server,{
        cors: {
            origin:process.env.CORS_ORIGIN, // Your frontend URL
            methods: ['GET', 'POST'],
        },
    });
    // io.on('connection', (socket) => {
    //     console.log('A user connected:', socket.id);
    
    //     // Handle custom events or notifications logic here
    //     // Example: Listening for a custom event
    //     socket.on('customEvent', (data) => {
    //         console.log('Custom event data:', data);
    //     });
    
    //     // Handle disconnection
    //     socket.on('disconnect', () => {
    //         console.log('User disconnected:', socket.id);
    //     });
    // });
connectDB()

.then(()=>{
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        
        Notification.find({ isRead: false }).then((notifications) => {
            socket.emit('missedNotifications', notifications);
        });
    
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    
    server.listen(process.env.PORT || 3000,()=>{
        console.log(`server is running at port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("mongodb connection failed",err)
})


export{io}
