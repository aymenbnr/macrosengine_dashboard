const mongoose = require("mongoose");

const ActivationSchema = new mongoose.Schema({
  licensekey: {
    type: String,
    required: true
  },
  hardwareId: {
    type: String,
    required: true
  }
});

const Activation = mongoose.model("Activation", ActivationSchema);

module.exports = Activation;
