const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  releasedate: {
    type: Date,
    required: true
  },
  summary: {
    type: String
  },
  changelog: {
    type: String
  },
  updateurl: {
    type: String
  }
});

const Version = mongoose.model('Version', VersionSchema);

module.exports = Version;