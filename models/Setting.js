const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  fieldtype: {
    type: String,
  },
});

const Setting = mongoose.model("Setting", SettingSchema);

module.exports = Setting;
