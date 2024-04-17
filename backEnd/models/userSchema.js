import mongoose from "mongoose";
import validator from "validator";

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
            if(!validator.isEmail(value)) {
                throw new Error("Not Valid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength:8,
    },
    token: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
})

const userModel = new mongoose.model("users", userSchema);

export default userModel