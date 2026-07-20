import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function testEmail() {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "utsavkalathiya98@gmail.com",
      subject: "Test OTP",
      text: "This is a test OTP email",
    });
    console.log("Test email sent!");
  } catch (err) {
    console.error("Email test failed:", err);
  }
}

testEmail();
