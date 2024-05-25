import specModel from "../models/specsSchema.js";
import directorateModel from "../models/directorateSchema.js";
import categoryModel from "../models/categorySchema.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";

const createSpec = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        try {
            const { uniqueNumber, directorate, specifications } = req.body;

            const userInstance = req.rootUser;
            const newSpec = new specModel({
                uniqueNumber,
                document: req.file.path,
                directorate,
                specifications: JSON.parse(specifications),
                createdBy: userInstance._id,
                updatedBy: userInstance._id
            });

            await newSpec.save();

            await directorateModel.findByIdAndUpdate(directorate, { $push: { specifications: newSpec._id } });

            for (const spec of JSON.parse(specifications)) {
                await categoryModel.findByIdAndUpdate(spec.category, { $push: { specifications: newSpec._id } });
            }

            res.status(200).json(newSpec);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}

const allSpecifications = async (req, res) => {
    try {
        const specifications = await specModel.find().populate('directorate').populate('specifications.category').exec();
        res.status(200).json(specifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSpecs = async (req, res) => {
    try {
        const specification = await specModel.findById(req.params.id).populate('directorate').populate('specifications.category').exec();
        if (!specification) {
          return res.status(404).json({ message: 'Specification not found' });
        }
        res.status(200).json(specification);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export { createSpec, allSpecifications, getSpecs }