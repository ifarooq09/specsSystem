import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
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

const categoryModel = mongoose.model("categories", categorySchema);

export default categoryModel;
