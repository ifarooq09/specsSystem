const roleBasedAccess = (rolesAllowed) => {
    return (req, res, next) => {
        const userRole = req.rootUser.role;

        if (rolesAllowed.includes(userRole)) {
            return next()
        } else {
            return res.status(403).json({ message: "Access denied. You do not have permission to perform this action."})
        }
    }
}

export default roleBasedAccess