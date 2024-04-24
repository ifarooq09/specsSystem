import jwt from "jsonwebtoken";
import userModel from "../models/userSchema.js";
import { key } from "../key.js";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new Error("No token provided");
        }

        const decodedToken = jwt.verify(token, key);
        
        const rootUser = await userModel.findOne({ _id: decodedToken._id });

        if (!rootUser) {
            throw new Error("User not found");
        }

        // Check token expiration
        if (Date.now() >= decodedToken.exp * 1000) {
            throw new Error("Token expired");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ status: 401, message: "Token expired" });
        } else {
            res.status(401).json({ status: 401, message: error.message || "Unauthorized" });
        }
    }
}


export default authenticate