import mongoose from "mongoose";

const specSchema = new mongoose.Schema({
    uniqueNumber: {
        type: String,
        required: true,
        unique: true
    },
    document: {
        type: String,
        required: true
    },
    directorate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'directorates',
        required: true
    },
    specifications: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
}, {
    timestamps: true
});

const specModel = new mongoose.model("specifications", specSchema);

export default specModel;
