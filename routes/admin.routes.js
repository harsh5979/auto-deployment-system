const express = require("express");
const { getUsers, getProjects, deleteProject, getAdminSettings, updateAdminSettings } = require("../controllers/admin.controller");
const {verifyToken} = require("../middlewares/verifyToken"); // optional: check admin role
const {verifyAdmin} = require("../middlewares/verifyAdmin");
const router = express.Router();

// Admin-only routes
router.get("/users", verifyToken, verifyAdmin, getUsers);
router.get("/projects", verifyToken, verifyAdmin, getProjects);
router.delete("/projects/:projectId", verifyToken, verifyAdmin, deleteProject);
router.get("/settings", verifyToken, verifyAdmin, getAdminSettings);
router.patch("/settings", verifyToken, verifyAdmin, updateAdminSettings);


module.exports = router;
