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
        }

    } catch (error) {

    }
}

export { createUser };