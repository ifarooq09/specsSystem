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
        user: userInstance._id
      });

      await finalDirectorate.save();
      return res.status(200).json({ message: "Directorate created successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

const alldirectorate = async (req,res) => {
  try {
    const directorates = await directorateModel.find({})
      .populate({
        path: "user",
        select: "firstName lastName",
      })
      .exec();

    res.status(200).json(directorates);
  } catch (error) {
    console.error("Error fetching directorates:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { createDirectorate, alldirectorate };
