const express = require("express");
const router = express.Router();

const { ProcessIpnRequest } = require("../Core/ipnProcessor");

router.post("/:endpoint", async (req, res) => {
  try {
    console.log("REQUEST params >> : " + JSON.stringify(req.params));
    console.log("REQUEST body raw >> : " + req.body);
    console.log("REQUEST body >> : " + JSON.stringify(req.body));
    var response = await ProcessIpnRequest(req.params.endpoint, req);
    res.json(response);
  } catch (error) {
    console.error("IPN ERROR >> " + error);
    res.json(error);
  }
});

module.exports = router;
