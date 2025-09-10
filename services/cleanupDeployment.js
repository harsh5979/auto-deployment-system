const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Cleanup cloned folder and container if deployment fails
 * @param {string} userId - user folder
 * @param {string} appName - app folder
 * @param {string} containerName - docker container name
 */
function cleanupDeployment(userId, appName, containerName) {
  try {
    // 1️⃣ Remove Docker container if exists
    if (containerName) {
      console.log(`[CLEANUP] Stopping container: ${containerName}`);
      execSync(`docker rm -f ${containerName}`, { stdio: "inherit", shell: true });
    }

    // 2️⃣ Remove cloned folder
    const appPath = path.join("/home", userId, appName);
    if (fs.existsSync(appPath)) {
      console.log(`[CLEANUP] Removing folder: ${appPath}`);
      fs.rmSync(appPath, { recursive: true, force: true });
    }

    console.log("[CLEANUP] Deployment cleanup completed.");
  } catch (err) {
    console.error("[CLEANUP] Error during cleanup:", err.message);
  }
}

module.exports = { cleanupDeployment };
