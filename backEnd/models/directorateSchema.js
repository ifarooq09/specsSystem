import mongoose from "mongoose";

const directorateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    specifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'specifications'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});

const directorateModel = mongoose.model("directorates", directorateSchema);

export default directorateModel;
