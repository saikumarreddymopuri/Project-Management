import mongoose from "mongoose";
import { User } from "./user.js";
import { Phase } from "./phase.js";
const notificationSchema = new mongoose.Schema({
    message: String,
    type: {type:String,default:'uploaded the file'}, // 'upload' or 'download'
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const Notification = mongoose.model('Notification', notificationSchema);