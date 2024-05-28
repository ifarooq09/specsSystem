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
        const specification = await specModel.findById(req.params.id)
          .populate({
            path: 'directorate',
            model: 'directorates',
            select: 'name',
          })
          .populate({
            path: 'specifications.category',
            model: 'categories',
            select: 'categoryName',
          })
          .populate({
            path: 'createdBy',
            model: 'users',
            select: 'firstName lastName',
          })
          .populate({
            path: 'updatedBy',
            model: 'users',
            select: 'firstName lastName',
          })
          .exec();
    
        if (!specification) {
          return res.status(404).json({ message: 'Specification not found' });
        }
    
        res.status(200).json(specification);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const updateSpec = async (req, res) => {
  const { id } = req.params;
  const { category, description, updatedBy } = req.body;

  try {
    const updatedFields = {};
    if (category) updatedFields['specifications.$.category'] = category;
    if (description) updatedFields['specifications.$.description'] = description;
    if (updatedBy) updatedFields.updatedBy = updatedBy;

    const userInstance = req.rootUser;
    const updatedSpecification = await specModel.findOneAndUpdate(
      { _id: id, "specifications._id": category, updatedBy: userInstance._id }, // Find specification by id and category
      { $set: updatedFields },
      { new: true }
    ).populate('createdBy updatedBy', 'firstName lastName');

    if (!updatedSpecification) {
      return res.status(404).json({ error: "Specification not found" });
    }

    res.status(200).json({
      message: "Directorate updated successfully",
      updatedSpecification: {
          ...updatedSpecification.toObject(),
          createdBy: updatedSpecification.createdBy,
          updatedBy: updatedSpecification.updatedBy
      }
  })
  } catch (error) {
    console.error("Error updating specification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { createSpec, allSpecifications, getSpecs, updateSpec }