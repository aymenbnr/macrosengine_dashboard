const express = require("express");
const router = express.Router();
const Settings = require("../models/Setting");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const { CreateZipBackup, SaveBlobBackup } = require("../Core/DBExtractor");
const formidable = require("formidable");
const dotenv = require("dotenv");
dotenv.config();

// add api key
router.get("/export", ensureAuthenticated, async (req, res) => {
  if (process.env.BACKUP == "blob") {
    SaveBlobBackup();
  } else {
    CreateZipBackup().then((zip) => {
      res.redirect(zip);
    });
  }
});

router.post("/import", ensureAuthenticated, async (req, res) => {
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      throw err;
    }
    console.log("Fields", fields);
    console.log("Files", files);
    for (const file of Object.entries(files)) {
      console.log(file);
    }
    res.json(files);
  });
});

module.exports = router;
