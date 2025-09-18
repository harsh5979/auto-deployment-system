const { handleDeploy } = require("../services/deployService");
const Project = require("../models/Project.model");
const { cleanupDeployment } = require("../services/cleanupDeployment");


const { addLog } = require("../helpers/logsShow");
const AdminModel = require("../models/Admin.model");
const ProjectModel = require("../models/Project.model");
const { pauseDeployment } = require("../services/pauseService");

exports.deployApp = async (req, res) => {
  const { repoUrl, appNames, type, port, customDomain, env } = req.body;
  const userId = req.userId;
  const appName = appNames?.trim().toLowerCase().replace(/\s+/g, '');


  if (!repoUrl || !userId || !appName || !type) {
    return res.status(400).json({ error: "Missing repoUrl, userId, appName or type" });
  }
  if (type === "backend" && !port) {
    return res.status(400).json({ error: "Missing port for backend application" });

  }

  try {
    const admin = await AdminModel.findOne();

    // 🚫 check if project creation is allowed
    if (admin && !admin.allowNewProjects) {
      return res.status(503).json({
        success: false,
        error: "Project creation temporarily disabled due to server load. Please try again later.",
      });
    }

    // 🚫 optional: limit projects per user
    const userProjects = await Project.countDocuments({ owner: userId , status: "running" });
    if (admin && userProjects >= admin.maxProjectsPerUser) {
      return res.status(403).json({
        success: false,
        error: `You can only create up to ${admin.maxProjectsPerUser} projects.`,
      });
    }

    const existingProject = await Project.findOne({ appName });
    if (existingProject && existingProject?.status != "error") {
      throw new Error(`Project with name ${appName} already exists`);
    }
    // 1️⃣ Create Project entry in DB → status "deploying"
    let project = await Project.create({
      appName,
      repoUrl,
      type: type,
      owner: userId,
      status: "deploying",
      logs: [{ message: "Deployment started", level: "info", ts: new Date() }],
      env: env || {}
    });

    // Respond early → frontend can start polling logs
    res.status(202).json({
      success: true,
      error: "Deployment started",
      projectId: project._id,
    });

    try {
      await addLog(project._id, "Cloning repository...");
      const deployedUrl = await handleDeploy(repoUrl, userId, appName, type, port, env, customDomain);

      await addLog(project._id, "Deployment completed successfully ✅");

      // 3️⃣ Success → update project in DB
      await Project.findByIdAndUpdate(project._id, {
        domain: deployedUrl,
        status: "running",
        $push: {
          deployHistory: {
            commitHash: "N/A", // TODO: fetch actual commit
            branch: "main",
            status: "success",
          },
        },
      });
    } catch (pipelineError) {
      console.error("Pipeline Error:", pipelineError);
      cleanupDeployment(userId, appName, `${appName}`);

      await addLog(project._id, pipelineError || "Deployment failed ❌", "error");

      // 4️⃣ Error → update status
      await Project.findByIdAndUpdate(project._id, {
        status: "error",
        $push: {
          deployHistory: {
            commitHash: "N/A",
            branch: "main",
            status: "failed",
          },
        },
      });
    }
  } catch (err) {
    console.error("Deployment Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getUserProjects = async (req, res) => {
  const userId = req.userId;

  try {
    const projects = (await Project.find({ owner: userId }).select('-logs -deployHistory -__v').lean()).reverse();
    res.status(200).json({ projects });
  } catch (err) {
    console.error("Fetch Projects Error:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}
exports.getProject = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.userId;

  try {
    const project = await Project.findOne({ _id: projectId, owner: userId }).select(' -deployHistory -__v').lean();
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (err) {
    console.error("Fetch Project Error:", err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
 
}
exports.getLogs = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.userId;

  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId" });
  }

  try {
    const project = await Project.findOne({ _id: projectId, owner: userId }).select("logs");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ logs: project.logs });
  } catch (err) {
    console.error("Fetch Logs Error:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}


exports.checkAppname = async (req, res) => {

  const { appName } = req.body;

  if (!appName) return res.json({ valid: false, message: "App Name is required" });

  // Example: check if appName exists in DB
  const exists = await ProjectModel.findOne({ appName });
  if (exists) return res.json({ valid: false, message: "App Name already exists" });

  // Optional: regex validation
  const validFormat = /^[a-zA-Z0-9-]+$/.test(appName);
  if (!validFormat) return res.json({ valid: false, message: "Invalid App Name format. only Letters and '-' are allowed." });

  return res.json({ valid: true, message: `${appName} Name is available` });
}


exports.editProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updated = await Project.findOneAndUpdate(
      { _id: projectId, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.pauseProject = async (req, res) => {
  try {
    const userId= req.userId;
    const { id } = req.params;
    const result = await pauseDeployment(userId, appName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
     const result = await deleteDeployment(userId, appName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


