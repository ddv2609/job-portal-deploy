const nodeMailer = require("nodemailer");

require("dotenv").config();

module.exports.sendMail = (to, subject, htmlContent) => {
  const transport = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.mailUsername,
      pass: process.env.appPassword,
    },
  });

  const options = {
    from: `${process.env.APP_NAME} <${process.env.mailUsername}>`,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  return transport.sendMail(options);
};
