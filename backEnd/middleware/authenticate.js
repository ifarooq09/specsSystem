import jwt from "jsonwebtoken";
import userModel from "../models/userSchema.js";
import { key } from "../key.js";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.error("No token provided");
            return res.status(401).json({ status: 401, message: "No token provided" });
        }

        const decodedToken = jwt.verify(token, key);
        
        const rootUser = await userModel.findOne({ _id: decodedToken._id }); 

        if (!rootUser) {
            console.error("User not found");
            return res.status(401).json({ status: 401, message: "User not found" });
        }

        // Check token expiration
        if (Date.now() >= decodedToken.exp * 1000) {
            console.error("Token expired");
            return res.status(401).json({ status: 401, message: "Token expired" });
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id; 

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 401, message: "Token expired" });
        } else {
            return res.status(401).json({ status: 401, message: error.message || "Unauthorized" });
        }
    }
};

export default authenticate;
