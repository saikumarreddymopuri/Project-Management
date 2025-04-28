import express from "express";
import { registerUser } from "../controllers/usercontroller.js";
import { authUser } from "../controllers/usercontroller.js";
import { Router } from "express";
import { blacklistToken,isTokenBlacklisted } from "../middleware/auth.middleware.js";

const router=Router()

console.log("hi")

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.post('/logout', blacklistToken);
export default router
