import mongoose from "mongoose";


const directorateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

const directorateModel = new mongoose.model("directorates", directorateSchema)

export default directorateModel