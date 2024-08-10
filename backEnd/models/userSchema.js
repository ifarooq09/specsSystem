import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { key } from "../key.js";
import { Timestamp } from "mongodb";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not Valid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
},
{
    timestamps: true
})

//hash password

userSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    
   next();
}) 

//token generation
userSchema.methods.generateAuthToken = async function () {
    try {
        let userToken = jwt.sign({ _id: this._id }, key, {
            expiresIn: "24h"
        });

        this.tokens = this.tokens.concat({ token: userToken });
        await this.save();
        return userToken;
    } catch (error) {
        resizeBy.status(422).json(error);
    }
};


const userModel = new mongoose.model("users", userSchema);

export default userModel