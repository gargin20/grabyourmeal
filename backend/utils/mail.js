import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS, // Gmail App Password
  },
});

const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"GRABYOURMEAL" <${process.env.EMAIL}>`,
    to,
    subject: "Your OTP for GRABYOURMEAL",
    html: `<h2>Your OTP is ${otp}</h2><p>It expires in 5 minutes</p>`,
  });
};

export default sendOtpMail;