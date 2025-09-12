// jobs/cleanupJob.js
const cron = require("node-cron");
const Project = require("../models/Project.model");
const Admin = require("../models/Admin.model");
const { cleanupDeployment } = require("../services/cleanupDeployment");

async function startCleanupJob() {
  cron.schedule("0 0 * * *", async () => {
    console.log("[CRON] Running daily cleanup job...");
    const now = new Date();

    try {
      // 🛠 fetch admin settings
      const admin = await Admin.findOne();
      const trialDays = admin ? admin.trialPeriodDays : 7;

      const projects = await Project.find({ status: "running" }).populate("owner");

      for (const project of projects) {
        const ageInDays = (now - project.createdAt) / (1000 * 60 * 60 * 24);

        if (ageInDays >= trialDays && project.owner.subscription === "free") {
          console.log(`[CLEANUP] Free trial expired for ${project.appName}`);

          // cleanup resources
          cleanupDeployment(project.owner._id.toString(), project.appName, project.appName);

          // Update DB
          project.status = "stopped";
          project.logs.push({
            message: `Free trial expired after ${trialDays} days. Project auto-stopped & cleaned.`,
            level: "info",
          });
          await project.save();
        }
      }
    } catch (err) {
      console.error("[CRON] Cleanup job failed:", err.message);
    }
  });
}

module.exports = { startCleanupJob };
