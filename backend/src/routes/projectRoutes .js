import express from "express";

import { createProject,getProjects,getProjectById,getPhasesByProjectId,removetheproject,changeprojectdetails } from "../controllers/projectcontroller.js";
import { protect,admin } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router=Router()

router.route('/').post(protect, admin, createProject).get(protect, getProjects);
router.route('/:id').get(protect, getProjectById);
router.route('/k/:projectId').get(protect, getPhasesByProjectId);
router.route('/:projectId').post(protect, removetheproject);
router.route('/k2/:id').put(protect, changeprojectdetails);
export default router