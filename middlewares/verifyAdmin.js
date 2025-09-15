const AdminModel = require("../models/Admin.model");
const User = require("../models/User.model"); // if your token contains user info

exports.verifyAdmin = async (req, res, next) =>{
  try {
    // assume verifyToken already added userId to req
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

    // fetch user role, assuming your User model has a `role` field
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "usar") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
