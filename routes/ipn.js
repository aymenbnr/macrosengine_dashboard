const express = require("express");
const router = express.Router();

const { ProcessIpnRequest } = require("../Core/ipnProcessor");

router.post("/:endpoint", async (req, res) => {
  var response = await ProcessIpnRequest(req.params.endpoint, req, res);
  res.json(response);
});

module.exports = router;
