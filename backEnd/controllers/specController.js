import specModel from "../models/specsSchema.js";
import directorateModel from "../models/directorateSchema.js";
import categoryModel from "../models/categorySchema.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";
import moment from 'moment-hijri';

// Function to convert Arabic numerals to Western numerals
const convertArabicToWestern = (arabicNumber) => {
  const arabicToWesternMap = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  return arabicNumber.replace(/[٠-٩]/g, (match) => arabicToWesternMap[match]);
};

const generateUniqueNumber = async (req, res) => {
  try {
    // Get current Hijri date
    const now = moment();
    const hijriDate = now.format('iYYYY-iMM-iDD');
    
    // Convert Hijri date to Western numerals
    const [year, month, day] = hijriDate.split('-').map(convertArabicToWestern);

    // Convert to native Date object and start of the day
    const todayStart = moment().startOf('day').toDate();

    // Count documents created today
    const countToday = await specModel.countDocuments({
      createdAt: { $gte: todayStart },
    });

    // Generate unique number
    const uniqueNumber = `${year}-${month}${day}-${countToday + 1}`;

    res.status(200).json({ uniqueNumber });
  } catch (error) {
    console.error("Error generating unique number:", error.message);
    res.status(500).json({ message: error.message });
  }
};
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
    res.status(200).json({
      status: 200,
      specReport: specifications
    });
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
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { id } = req.params;
      const userInstance = req.rootUser;
      let document;
      let specifications;

      if (req.file) {
        console.log("File uploaded:", req.file);
        document = req.file.path;
      } else {
        console.log("No file uploaded");
      }

      if (req.body.specifications) {
        try {
          specifications = JSON.parse(req.body.specifications);
        } catch (error) {
          return res.status(400).json({ message: "Invalid specifications format" });
        }
      }

      try {
        const specification = await specModel.findById(id);

        if (!specification) {
          return res.status(404).json({ message: "Specification not found" });
        }

        if (req.body.uniqueNumber) {
          specification.uniqueNumber = req.body.uniqueNumber;
        }
        if (req.body.directorate) {
          specification.directorate = req.body.directorate;
        }
        if (specifications) {
          specification.specifications = specifications.map(spec => ({
            category: spec.category,
            description: spec.description,
            warranty: spec.warranty,
          }));
        }
        if (document) {
          specification.document = document;
        }

        specification.updatedBy = userInstance._id;

        await specification.save();
        res.status(200).json(specification);
      } catch (error) {
        console.error("Error updating specification:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const deleteSpec = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteSpec = await specModel.findByIdAndDelete(id);

    if (!deleteSpec) {
      return res.status(404).json({ error: "Spec not found" });
    }

    // Remove the specification ID from the corresponding directorate and category documents
    await Promise.all([
      directorateModel.updateMany(
        { specifications: id },
        { $pull: { specifications: id } }
      ),
      categoryModel.updateMany(
        { specifications: id },
        { $pull: { specifications: id } }
      )
    ]);

    res.status(200).json({ message: "Specification deleted successfully" });
  } catch (error) {
    console.error("Error deleting specification: ", error.message);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};


const deleteItem = async (req, res) => {
  const { specId, itemId } = req.params;
  try {
    const updatedSpec = await specModel.findByIdAndUpdate(
      specId,
      { $pull: { specifications: { _id: itemId } } },
      { new: true }
    ).populate('createdBy updatedBy', 'firstName lastName');

    if (!updatedSpec) {
      return res.status(404).json({ error: "Specification not found" });
    }

    res.status(200).json({
      message: "Item deleted successfully",
      updatedSpec,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createSpec, allSpecifications, getSpecs, updateSpec, deleteItem, deleteSpec, generateUniqueNumber};
