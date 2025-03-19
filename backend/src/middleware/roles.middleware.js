const requireWriterRole = (req, res, next) => {
    if (req.user.role !== "writer" && req.user.role !== "admin") {
        return res
            .status(403)
            .json({ error: "Access denied. Only writers can post articles." });
    }
    next();
};

const requireAdminRole = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

module.exports = { requireWriterRole, requireAdminRole };
