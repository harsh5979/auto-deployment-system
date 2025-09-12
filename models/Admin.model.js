// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  trialPeriodDays: {
    type: Number,
    default: 7, // default trial period
  },
  allowNewProjects: {
    type: Boolean,
    default: true, 
  },
  maxProjectsPerUser: {
    type: Number,
    default: 1, // optional: limit concurrent projects
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
