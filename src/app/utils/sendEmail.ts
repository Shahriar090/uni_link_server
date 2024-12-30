import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'shahriarh655@gmail.com',
      pass: 'mckd jelu mihy mscc',
    },
  });

  await transporter.sendMail({
    from: 'shahriarh655@gmail.com', // sender address
    to, // list of receivers
    subject: 'Hello There, Here Is Your Reset Password Link', // Subject line
    text: 'Reset Your Password Within 10 Minutes!⏱️', // plain text body
    html, // html body
  });
};
