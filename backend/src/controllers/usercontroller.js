import { User } from "../models/user.js";
import mongoose from "mongoose";
import { generateToken } from "../utils/generateToken.js";
import jwt  from "jsonwebtoken";
const registerUser = async (req, res) => {
    const { username, password, role, registrationKey } = req.body;
  
    if (role === 'director' && registrationKey !== process.env.REGISTRATION_KEY) {
      return res.status(400).json({ message: 'Invalid registration key' });
    }
    if (role === 'technical_officer' && registrationKey !== process.env.REGISTRATION_KEY2) {
      return res.status(400).json({ message: 'Invalid registration key' });
    }
  
    const userExists = await User.findOne({ username });
  
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const user = await User.create({ username, password, role, registrationKey });
    console.log(user)
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  };
  
  const authUser = async (req, res) => {
    const { username, password,role } = req.body;
  
    const user = await User.findOne({ username });
  
    if (user && (await user.matchPassword(password)) && (user.role == role)) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  };
  const logoutUser = (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};

  export{registerUser,authUser,logoutUser}