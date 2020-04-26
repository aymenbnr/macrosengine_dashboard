const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  license: {
    type: String
  },
  /* orders, activations, usage, activity ...  */
  logtype: {
    type: String,
    required: true
  },
  logtext: {
    type: String,
    required: true
  },
  logdate: {
    type: Date,
    required: true
  },
  /* paypal, clickbank, jvzoo, ip of user, hardwareID, username (for user activity on the server) etc... */
  logsource: {
    type: String
  }
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;
