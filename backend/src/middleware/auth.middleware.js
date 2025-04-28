import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const protect = async (req, res, next) => {
    let token;
  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };
  
  const admin = (req, res, next) => {
    if (req.user && req.user.role === 'director') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  };
  
  const project = (req, res, next) => {
    if (req.user && req.user.role ==='project') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as a project' });
    }
  };
  const technicalOfficer = (req, res, next) => {
    if (req.user && req.user.role === 'technical_officer') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a technical officer' });
    }
};

  let blacklistedTokens = [];

export const isTokenBlacklisted = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (blacklistedTokens.includes(token)) {
        return res.status(401).json({ message: "Invalid token" });
    }
    next();
};

export const blacklistToken = (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    blacklistedTokens.push(token);
    res.status(200).json({ message: "Logged out successfully" });
};

  export {protect,admin,project,technicalOfficer}
