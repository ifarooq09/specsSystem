import userModel from "../models/userSchema.js";
import mongoose from "mongoose";


const createUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(422).json({ error: "fill all the details"})
    }

    try {
        const preUser = await userModel.findOne({ email: email});

        if(preUser) {
            res.status(422).json({ error: "This Email Already Exist"})
        } else {
            const finalUser = new userModel({
                firstName,
                lastName,
                email,
                password
            })

            //password hashing
            await finalUser.save();
            return res.status(200).json({ message: "User created successfully" });         
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Something went wrong, please try again later" });
    }
}

export { createUser };