const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  nbCalls: {
    type: Number,
    required: true
  }
});

const ApiKey = mongoose.model('ApiKey', ApiKeySchema);

module.exports = ApiKey;