const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  project: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    required: true
  },
  license: {
    type: String
  },
  addons: {
    type: Array
  }
});

const Code = mongoose.model("Code", CodeSchema);

module.exports = Code;
