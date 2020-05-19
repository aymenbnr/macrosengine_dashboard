const express = require("express");
const router = express.Router();

const { ProcessIpnRequest } = require("../Core/ipnProcessor");

router.post("/:endpoint", async (req, res) => {
  try {
    var response = await ProcessIpnRequest(req.params.endpoint, req, res);
    res.json(response);
  } catch (error) {
    console.log("IPN ERROR >> " + error);
    res.json(error);
  }
});

module.exports = router;
