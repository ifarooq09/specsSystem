import userModel from "../models/userSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import authenticate from "../middleware/authenticate.js";


const createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
        const preUser = await userModel.findOne({ email: email });

        if (preUser) {
            res.status(422).json({ error: "This Email Already Exist" })
        } else {
            const finalUser = new userModel({
                firstName,
                lastName,
                email,
                password,
                role
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
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(420).json({ error: "Please provide email and password" });
    }
    try {
        const userValid = await userModel.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (!userValid) {
            return res.status(421).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, userValid.password);
        if (!isMatch) {
            return res.status(422).json({ error: "Password is incorrect" });
        }
        const { active } = userValid;
        if (!active) {
            return res.status(423).json({ success: false, message: "This account has been suspended! Try to contact the admin" });
        }
        // Token generation
        const token = await userValid.generateAuthToken();
        // Cookie generation
        res.cookie("usercookie", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
            httpOnly: true
        });
        const result = {
            user: userValid,
            token
        };
        res.status(200).json({ status: 200, result });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




//user valid
const validuser = async (req, res) => {
    try {
        const validUserOne = await userModel.findOne({ _id: req.userId });
        res.status(200).json({ status: 200, validUserOne });
    } catch (error) {
        res.status(401).json(error)
    }
}

const alluser = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateUser = async (req, res) => {
    try {
        const { role, active } = req.body;
        await userModel.findByIdAndUpdate(req.params.userId, { role, active });
        res.status(200).json({ success: true, result: { _id: req.params.userId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const editProfile = async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
  
      const updateData = {
        firstName,
        lastName,
        email,
      };
  
      if (hashedPassword) {
        updateData.password = hashedPassword;
      }
  
      const updatedUser = await userModel.findByIdAndUpdate(req.userId, updateData, { new: true });
      res.status(200).json({ status: 200, updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//user logout
const logout = async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        })
        res.clearCookie("usercookie", { path: "/" });
        req.rootUser.save();
        res.status(200).json({ status: 200 })
    } catch (error) {
        res.status(401).json(error)
    }
}
 
export { createUser, login, validuser, logout, alluser, updateUser, editProfile };