const User = require("../models/User.model");
const Project = require("../models/Project.model");
const Admin = require("../models/Admin.model");

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET all projects (optionally filter by user)
exports.getProjects = async (req, res) => {
  try {
    const filter = req.query.userId ? { owner: req.query.userId } : {};
    const projects = await Project.find(filter).populate("owner", "name email").lean();
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE a specific project
exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.updateAdminSettings = async (req, res) => {
  try {
    const { allowNewProjects, maxProjectsPerUser, trialPeriodDays } = req.body;

    // Build the update object only with provided values
    const update = {};
    if (allowNewProjects !== undefined) update.allowNewProjects = allowNewProjects;
    if (maxProjectsPerUser !== undefined) update.maxProjectsPerUser = maxProjectsPerUser;
    if (trialPeriodDays !== undefined) update.trialPeriodDays = trialPeriodDays;
    update.updatedAt = new Date();

    if (Object.keys(update).length === 1) { // only updatedAt exists
      return res.status(400).json({ success: false, message: "No valid fields provided" });
    }

    const admin = await Admin.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// GET admin settings
exports.getAdminSettings = async (req, res) => {
  try {
    const admin = await Admin.findOne();
  //  new Admin(); // return defaults if not set
    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
