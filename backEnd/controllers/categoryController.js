import categoryModel from "../models/categorySchema.js";
import authenticate from "../middleware/authenticate.js";

const createCategory = async (req,res) => {
    const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(422).json({ error: "Please provide the category name" });
  }

  try {
    const preCategory = await categoryModel.findOne({ categoryName });

    if (preCategory) {
      return res.status(422).json({ error: "This category already exists" });
    }

    // Create the new category
    const userInstance = req.rootUser;
    const finalCategory = new categoryModel({
      categoryName,
      createdBy: userInstance._id,
      updatedBy: userInstance._id
    });

    await finalCategory.save();
    return res.status(200).json({ message: "Category created successfully" });

  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ error: "Something went wrong, please try again later" });
  }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;

    if(!categoryName) {
        return res.status(422).json({ error: "Please provide the category name"});
    }

    try {
        const userInstance = req.rootUser;
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { categoryName, updatedBy: userInstance._id},
            { new: true}
        ).populate('createdBy updatedBy', 'firstName lastName');

        if(!updatedCategory) {
            return res.status(404).json({ error: "Category not found"})
        }
        res.status(200).json({
            message: "Directorate updated successfully",
            updatedCategory: {
                ...updatedCategory.toObject(),
                createdBy: updatedCategory.createdBy,
                updatedBy: updatedCategory.updatedBy
            }
        })
    } catch (error) {
        console.error("Error updating Category:", error.message)
        res.status(500).json({ error: "Something went wrong, please try again later"})
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        if(!deletedCategory) {
            return res.status(404).json({ error: "Category not found "})
        }
        res.status(200).json({ message: "Category deleted successfully"});
    } catch (error) {
        console.error("Error deleting category: ", error.message)
        res.status(500).json ({ error: "Something went wrong, please try again later"})
    }
}

const allCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        .populate({
            path: "createdBy updatedBy",
            select: "firstName lastName"
        })
        .exec();

        res.status(200).json(categories)
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export { createCategory, updateCategory, deleteCategory, allCategories }

