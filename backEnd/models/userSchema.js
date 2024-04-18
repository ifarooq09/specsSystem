import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"

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

//hash password

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 12);

    await next();
})

const userModel = new mongoose.model("users", userSchema);

export default userModel