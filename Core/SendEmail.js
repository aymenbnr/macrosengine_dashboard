"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// async..await is not allowed in global scope, must use a wrapper
async function mailer(email) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_AUTH_USER, // generated ethereal user
      pass: process.env.SMTP_AUTH_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: email.email, // list of receivers
    subject: email.subject, // Subject line
    text: email.text, // plain text body
    html: email.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  return info;
}

module.exports = { mailer };
