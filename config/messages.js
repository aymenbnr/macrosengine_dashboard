const Setting = require("../models/Setting");

module.exports = {
  success: () => {
    return Setting.findOne({ name: "lic_success" });
  },
  failed: () => {
    return Setting.findOne({ name: "lic_failed" });
  },
  deactivated: () => {
    return Setting.findOne({ name: "lic_deactivated" });
  },
  expired: () => {
    return Setting.findOne({ name: "lic_expired" });
  },
  exceeded: () => {
    return Setting.findOne({ name: "lic_exceeded" });
  },
};
