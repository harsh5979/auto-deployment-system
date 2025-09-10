// helpers/logService.js
const Project = require("../models/Project.model");

/**
 * Add log to deployment
 */
async function addLog(projectId, message) {
  await Project.findByIdAndUpdate(projectId, {
    $push: { logs: { message, timestamp: new Date() } },
  });
//   console.log(`[DEPLOY:${projectId}] ${message}`);
}

/**
 * Update deployment status
 */
async function updateStatus(projectId, status) {
  await Project.findByIdAndUpdate(projectId, { status });
//   console.log(`[DEPLOY:${projectId}] STATUS -> ${status}`);
}

module.exports = { addLog, updateStatus };
