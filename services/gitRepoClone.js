const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Clone repo into ~/userId/appName
 * @param {string} repoUrl
 * @param {string} userId
 * @param {string} appName
 * @returns {string} fullPath
 */
function cloneRepo(repoUrl, userId, appName) {
  if (!repoUrl || !userId || !appName) {
    throw new Error("repoUrl, userId, and appName are required");
  }

  const homeDir = "/home"                    // e.g. /home/ubuntu
  const userDir = path.join(homeDir, userId);        // /home/ubuntu/<userId>
  const appPath = path.join(userDir, appName);       // /home/ubuntu/<userId>/<appName>

  // 1. Ensure user directory exists
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
    console.log(`[INFO] Created user folder: ${userDir}`);
  }

  // 2. If app already exists, stop
  if (fs.existsSync(appPath)) {
    console.log(`[INFO] App already exists at: ${appPath}`);
    return appPath;
  }

  // 3. Clone repo
  console.log(`[INFO] Cloning repo ${repoUrl} -> ${appPath}`);
  execSync(`git clone ${repoUrl} ${appPath}`, { stdio: "inherit", shell: true });

  return appPath;
}

module.exports = { cloneRepo };
