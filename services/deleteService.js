const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const Project = require("../models/Project.model"); // Your Mongoose model

/**
 * Delete deployment: remove Docker container, app folder & DB entry
 * @param {string} userId
 * @param {string} appName
 */
async function deleteDeployment(userId, appName) {
  const containerName = appName.toLowerCase();
  const appPath = path.join("/home", userId, appName);

  try {
    // 1️⃣ Remove Docker container
    console.log(`[DELETE] Removing container: ${containerName}`);
    execSync(`docker rm -f ${containerName}`, { stdio: "inherit", shell: true });

    // 2️⃣ Remove folder
    if (fs.existsSync(appPath)) {
      console.log(`[DELETE] Removing folder: ${appPath}`);
      fs.rmSync(appPath, { recursive: true, force: true });
    }

    // 3️⃣ Remove from DB
    const project = await Project.findOneAndDelete({ userId, appName });

    if (!project) {
      throw new Error("Project not found in DB");
    }

    console.log(`[DELETE] Project deleted successfully`);
    return { message: `Project ${appName} deleted successfully`, project };
  } catch (err) {
    console.error(`[DELETE] Error: ${err.message}`);
    throw new Error(`Failed to delete project ${appName}`);
  }
}

module.exports = { deleteDeployment };
