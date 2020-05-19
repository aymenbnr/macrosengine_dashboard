const { decryptIpn, processIpn } = require("./IPN/clickbankipn");
const { jvZooIpn } = require("./IPN/jvzooipn");
const { paypalIpn } = require("./IPN/paypalipn");
const Setting = require("../models/Setting");

async function ProcessIpnRequest(endpoint, req) {
  if (endpoint == "clickbank") {
    return await ClickBank(req);
  } else if (endpoint == "paypal") {
    return await PayPal(req);
  } else if (endpoint == "jvzoo") {
    return await JVZoo(req);
  }
}

async function ClickBank(req) {
  var cbSecret = "";
  var cbSetting = await Setting.findOne({ name: "cb_secret" });
  if (cbSetting) {
    cbSecret = cbSetting.value;
    var message = JSON.stringify(req.body);
    console.log(`clickbank ins message ${message}`);
    var notification = decryptIpn(cbSecret, req.body);
    console.log(`clickbank ins message ${JSON.stringify(notification)}`);
    if (notification != null) {
      var cbIpn = processIpn(notification);
      return { message: "clickbank ins request processed" };
    } else {
      return { message: "error decrypting clickbank message" };
    }
  } else {
    return { message: "secret key is empty" };
  }
}

async function PayPal(req) {
  return paypalIpn(req);
}

async function JVZoo(req) {
  var jvzooSecret = "";
  var jvSetting = await Setting.findOne({ name: "jvzoo_secret" });
  if (jvSetting) {
    jvzooSecret = jvSetting.value;
    console.log(`jvzoo ipn message ${req.body}`);
    var jvzooIpn = jvZooIpn(jvzooSecret, req);
    if (jvzooIpn == true) {
      return { message: "jvzoo ipn request processed" };
    } else {
      return { message: "jvzoo ipn request failed" };
    }
  }
}

module.exports = { ProcessIpnRequest };
