import userModel from "../models/userSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"


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

const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "fill all the details"})
    }

    try {
        const userValid = await userModel.findOne({email: email});

        if(userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);

            if(!isMatch) {
                res.status(422).json({ error: "password is incorrect"});
            } else {
                //token generation
                const token = await userValid.generateAuthtoken();

                //cookie generate
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now()+9000000),
                    httpOnly:true
                });

                const result = {
                    userValid,
                    token
                }

                res.status(200).json({ status: 200, result })
            }
        }
    } catch (error) {
        
    }
}

export { createUser, login };