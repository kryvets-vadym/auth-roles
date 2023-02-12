import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendActivationMail = async (to: string, link: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Account activation' + process.env.API_URL,
    text: '',
    html:
      `
        <div>
          <h1>Сlick on the link to activate</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
  });
};
