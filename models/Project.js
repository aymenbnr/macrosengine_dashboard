const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  secretkey: {
    type: String,
    required: true
  },
  updateurl: {
    type: String,
    required: true
  },
  installerurl: {
    type: String
  },
  notes: {
    type: String
  },
  activations: {
    type: Number,
    required: true
  },
  demotries: {
    type: String,
    required: true
  },
  demo: {
    type: Boolean,
    required: true
  },
  versionId: {
    type: String
  },
  latestVersion: {
    type: String
  },
  latestRelease: {
    type: String
  }
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
