import { Notification } from "../models/notification.js";
import { io } from '../index.js';
export const createNotification = async (message, type, phaseId) => {
    try{
    const notification = new Notification({ message, type, phaseId });
    await notification.save();
    console.log('Notification saved:', notification);
    
    // Emit the notification to the director's client
    console.log('Emitting notification:', { message, type, phaseId, createdAt: new Date() });
    io.emit('notification', { message, type,  phaseId, createdAt: new Date() });
    }catch(error){
        console.error('Error saving notification:', error);
    }
};

export const getUnreadNotifications = async (req, res) => {
    try {
        const unreadNotifications = await Notification.find({ isRead: false });
        res.status(200).json(unreadNotifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch unread notifications' });
    }
};

export const marknotificationsread=async (req,res) => {
    try {
        await Notification.updateMany({isRead:false},{$set:{isRead:true}});
        res.status(200).json({message:'marked as read'});
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
}