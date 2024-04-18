import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const key = "MySonNameIsMohammadSadqiMustafa_"

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
    tokens: [
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

//token generation
userSchema.methods.generateAuthtoken = async function() {
    try {
        let userToken = jwt.sign({_id:this._id, key},{
            expiresIn: "1d"
        });

        this.tokens = this.tokens.concat({token: userToken})
    } catch (error) {
        
    }
}

const userModel = new mongoose.model("users", userSchema);

export default userModel