import userModel from "../models/userSchema.js";
import specModel from "../models/specsSchema.js";
import bcrypt from "bcryptjs";

const createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        res.status(422).json({ error: "fill all the details" });
    }

    try {
        const preUser = await userModel.findOne({ email: email });

        if (preUser) {
            res.status(422).json({ error: "This Email Already Exist" });
        } else {
            const finalUser = new userModel({
                firstName,
                lastName,
                email,
                password,
                role
            });

            // Password hashing
            await finalUser.save();
            return res.status(200).json({ message: "User created successfully" });
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Something went wrong, please try again later" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(420).json({ error: "Please provide email and password" });
    }
    try {
        const userValid = await userModel.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (!userValid) {
            return res.status(421).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, userValid.password);
        if (!isMatch) {
            return res.status(422).json({ error: "Password is incorrect" });
        }
        const { active } = userValid;
        if (!active) {
            return res.status(423).json({ success: false, message: "This account has been suspended! Try to contact the admin" });
        }
        // Token generation
        const token = await userValid.generateAuthToken();
        // Cookie generation
        res.cookie("usercookie", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
            httpOnly: true
        });
        const result = {
            user: userValid,
            token
        };
        res.status(200).json({ status: 200, result });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const validuser = async (req, res) => {
    try {
        const validUserOne = await userModel.findOne({ _id: req.userId });
        res.status(200).json({ status: 200, validUserOne });
    } catch (error) {
        res.status(401).json(error);
    }
};

const getRole = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('role'); // Fetch user by ID and select only the role field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ role: user.role }); // Return user role
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }

}

const alluser = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password -tokens');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const viewUserCount = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password -tokens');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateUser = async (req, res) => {
    try {
        const { role, active, password } = req.body;

        const updateFields = { role, active };

        if (password) {
            updateFields.password = await bcrypt.hash(password, 12); // Hash the password here
        }

        await userModel.findByIdAndUpdate(req.params.userId, updateFields);
        res.status(200).json({ success: true, result: { _id: req.params.userId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const editProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        if (password) {
            user.password = password; // This will trigger the pre-save middleware to hash the password
            user.tokens = []; // Clear tokens array when the password is updated
        }

        const updatedUser = await user.save();
        res.status(200).json({ status: 200, updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getUserReport = async (req, res) => {
    try {
        const userId = req.params.id;
        const { startDate, endDate } = req.query;

        // Construct the date filter
        let dateFilter = {};
        if (startDate) {
            dateFilter.$gte = new Date(startDate);
        }
        if (endDate) {
            // Include the entire day for endDate by setting time to the end of the day
            dateFilter.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
        }

        // Build the query conditions
        let queryConditions = {
            $or: [
                { createdBy: userId },
                { updatedBy: userId },
            ]
        };

        // Add the date filter to the query if both startDate and endDate are provided
        if (startDate || endDate) {
            queryConditions.createdAt = dateFilter;
        }

        const specifications = await specModel.find(queryConditions)
            .populate('createdBy', 'firstName lastName')
            .populate('updatedBy', 'firstName lastName')
            .populate({
                path: 'specifications.category',
                select: 'categoryName'
            })
            .populate({
                path: 'directorate',
                select: 'name'
            });

        res.status(200).json({ status: 200, userReport: specifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const logout = async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token;
        });
        res.clearCookie("usercookie", { path: "/" });
        req.rootUser.save();
        res.status(200).json({ status: 200 });
    } catch (error) {
        res.status(401).json(error);
    }
};

export { createUser, login, validuser, logout, alluser, updateUser, editProfile, getUserReport, getRole, viewUserCount};
