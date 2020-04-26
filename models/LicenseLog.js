const mongoose = require("mongoose");

const LicenseLogSchema = new mongoose.Schema({
  licenseKey: {
    type: String,
    required: true,
  },
  activeDate: {
    type: Date,
    required: true,
  },
  lastAccessDate: {
    type: Date,
    required: true,
  },
  lastIP: {
    type: String,
    required: true,
  },
});

const LicenseLog = mongoose.model("LicenseLog", LicenseLogSchema);

module.exports = LicenseLog;
