import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export function catchErrors(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((error) => next(error));
  };
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
