import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export function catchErrors(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((error) => next(error));
  };
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
