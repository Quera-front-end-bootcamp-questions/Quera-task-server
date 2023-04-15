import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const EmailSender = (email: string, mailData: any, cB: any) => {
  const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.gmailEmail,
        pass: process.env.gmailPass,
      },
    });

  const mailOptions = {
    from: process.env.gmailEmail,
    to: email,
    subject: mailData.subject,
    html: mailData.html,
  };

  transporter.sendMail(mailOptions, async (error: any, info: any) => {
    const data = {
      error: error,
      info: info,
    };
    cB(data);
  });
};

export default EmailSender;
