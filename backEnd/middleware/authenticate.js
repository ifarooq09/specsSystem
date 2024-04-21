import jwt from "jsonwebtoken";
import userModel from "../models/userSchema.js";
import { key } from "../key.js";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        const verifyToken = jwt.verify(token, key);
        
        const rootUser = await userModel.findOne({_id: verifyToken._id});
        
        if(!rootUser) {
            throw new Error("user not found")
        }

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();
    } catch (error) {
        res.status(401).json({status: 401, message: "Unauthorized no token provided"})
    }
}

export default authenticate