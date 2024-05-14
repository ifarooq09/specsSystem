import directorateModel from "../models/directorateSchema.js";
import authenticate from "../middleware/authenticate.js";

const createDirectorate = async (req, res) => {
    const { name } = req.body;

    if ( !name ) {
        res.status(422).json({ error: "fill all the details"})
    }

    try {
        const preDirectorate = await directorateModel.findOne({ name: name});

        if(preDirectorate) {
            res.status(422).json({ error: "This directorate already exist"});
        } else {
            const userInstance = req.rootUser;
            const finalDirectorate = new directorateModel({
                name,
                user: userInstance._id
            })

            await finalDirectorate.save();
            return res.status(200).json({ message: "Directorate created successfully"});
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Something went wrong, please try again later" });
    }
}

export { createDirectorate };