const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({

  project: {
    type: String,
    required: true
  },
  licensekey: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  activations: {
    type: Number,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true
  },
  expirable: {
    type: Boolean,
  },
  expirydate: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now
  },
  addons: {
    type: Array,
  },
});

const License = mongoose.model('License', LicenseSchema);

module.exports = License;
