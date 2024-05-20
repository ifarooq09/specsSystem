import directorateModel from "../models/directorateSchema.js";
import authenticate from "../middleware/authenticate.js";

const createDirectorate = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(422).json({ error: "Please provide the directorate name" });
  }

  try {
    const preDirectorate = await directorateModel.findOne({ name });

    if (preDirectorate) {
      return res.status(422).json({ error: "This directorate already exists" });
    } else {
      const userInstance = req.rootUser;
      const finalDirectorate = new directorateModel({
        name,
        createdBy: userInstance._id,
        updatedBy: userInstance._id
      });

      await finalDirectorate.save();
      return res.status(200).json({ message: "Directorate created successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

const updateDirectorate = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(422).json({ error: "Please provide the directorate name" });
  }

  try {
    const userInstance = req.rootUser;
    const updatedDirectorate = await directorateModel.findByIdAndUpdate(
      id,
      { name, updatedBy: userInstance._id },
      { new: true }
    ).populate('createdBy updatedBy', 'firstName lastName');

    if (!updatedDirectorate) {
      return res.status(404).json({ error: "Directorate not found" });
    }

    res.status(200).json({
      message: "Directorate updated successfully",
      updatedDirectorate: {
        ...updatedDirectorate.toObject(),
        createdBy: updatedDirectorate.createdBy,
        updatedBy: updatedDirectorate.updatedBy,
      }
    });
  } catch (error) {
    console.error("Error updating directorate:", error.message);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};



const deleteDirectorate = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDirectorate = await directorateModel.findByIdAndDelete(id);

    if (!deletedDirectorate) {
      return res.status(404).json({ error: "Directorate not found" });
    }

    res.status(200).json({ message: "Directorate deleted successfully" });
  } catch (error) {
    console.error("Error deleting directorate:", error.message);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

const alldirectorate = async (req, res) => {
  try {
    const directorates = await directorateModel.find({})
      .populate({
        path: "createdBy updatedBy",
        select: "firstName lastName",
      })
      .exec();

    res.status(200).json(directorates);
  } catch (error) {
    console.error("Error fetching directorates:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createDirectorate, updateDirectorate, deleteDirectorate, alldirectorate };
