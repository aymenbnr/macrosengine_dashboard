const express = require("express");
const router = express.Router();
const { ensureAPIKeyValid, ensureTokenValid } = require("../config/auth");
const { ProcessApiRequest } = require("../Core/apiprocessor");
var nJwt = require("njwt");
const { CreateZipBackup, SaveBackupToTemp } = require("../Core/DBExtractor");
const { saveAs } = require("file-saver");
const { SendLicenseEmail } = require("../Core/IPN/LicenseFactory");

// add license

router.post("/:endpoint", async (req, res) => {
  try {
    ProcessApiRequest(req.params.endpoint, req, res);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
