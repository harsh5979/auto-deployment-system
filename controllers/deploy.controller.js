const { handleDeploy } = require("../services/deployService");
const Project = require("../models/Project.model");
const { cleanupDeployment } = require("../services/cleanupDeployment");


const { addLog } = require("../helpers/logsShow");

exports.deployApp = async (req, res) => {
  const { repoUrl, appName, type ,port,customDomain} = req.body;
  const userId = req.userId;

  if (!repoUrl || !userId || !appName || !type) {
    return res.status(400).json({ error: "Missing repoUrl, userId, appName or type" });
  }
  if (type ==="backend" && !port) {
    return res.status(400).json({ error: "Missing port for backend application" });
    
  }
  
  try {
    const existingProject = await Project.findOne({ appName });
    if (existingProject && existingProject?.status != "error") {
      throw new Error(`Project with name ${appName} already exists`);
    }
    // 1️⃣ Create Project entry in DB → status "deploying"
    let project = await Project.create({
      appName,
      repoUrl,
      type: type ,
      owner: userId,
      status: "deploying",
      logs: [{ message: "Deployment started", level: "info", ts: new Date() }],
    });

    // Respond early → frontend can start polling logs
    res.status(202).json({
      success: true,
      message: "Deployment started",
      projectId: project._id,
    });

    try {
      await addLog(project._id, "Cloning repository...");
      const deployedUrl = await handleDeploy(repoUrl, userId, appName, type,port,customDomain);

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
    const projects = await Project.find({ owner: userId }).select('-logs -deployHistory -__v').lean();
    res.status(200).json({ projects });
  } catch (err) {
    console.error("Fetch Projects Error:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}
