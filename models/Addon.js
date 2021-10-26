const mongoose = require("mongoose");

const AddonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: String,
    required: true
  },
  notes: {
    type: String
  }
});

const Addon = mongoose.model("Addon", AddonSchema);

module.exports = Addon;
