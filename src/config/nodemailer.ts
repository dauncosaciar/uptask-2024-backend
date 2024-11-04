import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const config = () => {
  return {
    host: process.env.SMTP_TESTING_HOST,
    port: +process.env.SMTP_TESTING_PORT,
    auth: {
      user: process.env.SMTP_TESTING_USER,
      pass: process.env.SMTP_TESTING_PASS
    }
  };
};

// Send emails in testing environment
export const transporter = nodemailer.createTransport(config());
