const { execSync } = require("child_process");
const Project = require("../models/Project.model"); // Your Mongoose model

/**
 * Pause a running deployment (stop Docker container & update DB)
 * @param {string} userId
 * @param {string} appName
 */
async function pauseDeployment(userId, appName) {
  const containerName = appName.toLowerCase();

  try {
    // 1️⃣ Stop Docker container
    console.log(`[PAUSE] Stopping container: ${containerName}`);
    execSync(`docker stop ${containerName}`, { stdio: "inherit", shell: true });

    // 2️⃣ Update status in DB
    const project = await Project.findOneAndUpdate(
      { userId, appName },
      { status: "paused" },
      { new: true }
    );

    if (!project) {
      throw new Error("Project not found in DB");
    }

    console.log(`[PAUSE] Project status updated to 'paused'`);
    return { message: `Project ${appName} paused successfully`, project };
  } catch (err) {
    console.error(`[PAUSE] Error: ${err.message}`);
    throw new Error(`Failed to pause project ${appName}`);
  }
}

module.exports = { pauseDeployment };
