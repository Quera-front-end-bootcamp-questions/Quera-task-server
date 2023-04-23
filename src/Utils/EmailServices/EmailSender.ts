import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const EmailSender = (email: string, mailData: any, cB: any) => {
  const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user:"salarnili.ir@gmail.com",
        pass: "tfkxtqworgkpbiqr",
      },
    });

  const mailOptions = {
    from: "salarnili.ir@gmail.com",
    to: email,
    subject: mailData.subject,
    html: mailData.html,
  };
  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  
  transporter.sendMail(mailOptions, async (error: any, info: any) => {
    const data = {
      error: error,
      info: info,
    };
    cB(data);
  });
};

export default EmailSender;
