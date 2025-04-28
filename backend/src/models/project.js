import mongoose from "mongoose";
import { Phase } from "./phase.js";

const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    teamLead: { type: String, required: true },
    phases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }],
    deadline:{type:mongoose.Schema.Types.ObjectId,ref:'Phase'},
  },{timestamps:true});
  
 export const Project = mongoose.model('Project', projectSchema);
 