const Setting = require("./models/Setting");

// license success message
Setting.findOne({ name: "lic_success" }).then(st => {
  if (!st) {
    const lic_success = new Setting({
      name: "lic_success",
      value: "message on license activated successfully",
      fieldtype: "richtext"
    });
    lic_success.save().then(stg => {
      console.log("setting added!" + stg.name);
    });
  }
});

Setting.findOne({ name: "lic_failed" }).then(st => {
  if (!st) {
    // license failed message
    const lic_failed = new Setting({
      name: "lic_failed",
      value: "message on license activation failure",
      fieldtype: "richtext"
    });
    lic_failed.save().then(stg => {
      console.log("setting added!" + stg.name);
    });
  }
});

Setting.findOne({ name: "lic_deactivated" }).then(st => {
  if (!st) {
    // license lic_deactivated message
    const lic_deactivated = new Setting({
      name: "lic_deactivated",
      value: "message when license deactivated",
      fieldtype: "richtext"
    });
    lic_deactivated.save().then(stg => {
      console.log("setting added!" + stg.name);
    });
  }
});

Setting.findOne({ name: "lic_expired" }).then(st => {
  if (!st) {
    // license lic_deactivated message
    const lic_expired = new Setting({
      name: "lic_expired",
      value: "message when license expired",
      fieldtype: "richtext"
    });
    lic_expired.save().then(stg => {
      console.log("setting added!" + stg.name);
    });
  }
});

Setting.findOne({ name: "lic_exceeded" }).then(st => {
  if (!st) {
    // license lic_deactivated message
    const lic_expired = new Setting({
      name: "lic_exceeded",
      value: "message when license activations are reached it's limit!",
      fieldtype: "richtext"
    });
    lic_expired.save().then(stg => {
      console.log("setting added!" + stg.name);
    });
  }
});

//
//IPN SEttings
//

Setting.findOne({ name: "cb_secret" }).then(st => {
  if (!st) {
    // clickbank secret key
    const cb_secret = new Setting({
      name: "cb_secret",
      value: "clickbank secret key",
      fieldtype: "text"
    });
    cb_secret.save().then(stg => {
      console.log("setting added!" + stg.name);
    });
  }
});

Setting.findOne({ name: "jvzoo_secret" }).then(st => {
  if (!st) {
    // jvzoo secret key
    const jvzoo_secret = new Setting({
      name: "jvzoo_secret",
      value: "jvzoo secret key",
      fieldtype: "text"
    });
    jvzoo_secret.save().then(stg => {
      console.log("setting added!" + stg.name);
    });
  }
});
