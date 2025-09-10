const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      // unique: true,
      required: true,
      trim: true,
    },
    repoUrl: { type: String, required: true },
    port: Number,
    domain: String,
    containerId: { type: String, index: true },
    type: { type: String, enum: ["frontend", "backend"], default: "frontend" },
    env: { type: Map, of: String, default: {} },
    status: {
      type: String,
      enum: ["running", "stopped", "error", "deploying"],
      default: "deploying",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    logs: [
      {
        message: String,
        level: { type: String, enum: ["info", "warn", "error"], default: "info" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    deployHistory: [
      {
        commitHash: String,
        branch: String,
        deployedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["success", "failed"], default: "success" },
      },
    ],
  },
  { timestamps: true }
);

projectSchema.index({ appName: 1 });

// ✅ Prevent OverwriteModelError on nodemon reload
module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
