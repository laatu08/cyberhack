import express from "express";
import { otpStore } from "../data/otpStore";
import { prisma } from "../prisma";
import nodemailer from "nodemailer";
import { consentTemplates } from "../data/consentTemplates";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, appId } = req.body;
  if (!email || !appId)
    return res.status(400).json({ message: "Email and App ID are required" });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res.status(404).json({ message: "User not found in bank" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    const template = consentTemplates[appId];
    if (!template) {
      return res
        .status(400)
        .json({ status: "rejected", reason: "Unknown app" });
    }

    // Send OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your OTP for ${appId.toUpperCase()} Registration`,
      text: `
Hello,

You have initiated a registration process on ${appId.toUpperCase()}.

Your One-Time Password (OTP) is: ${otp}

By verifying with this OTP, you consent to share the following data:
${template.dataFields.map((field) => `- ${field.toUpperCase()}`).join("\n")}

This OTP is valid for 10 minutes. Please do not share this code with anyone.

If you did not initiate this request, please ignore this email.

Thank you,  
VaultGuard Team
  `.trim(),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    console.log(`Generated OTP for ${email}: ${otp}`);
    return res.json({ message: `Generated OTP for ${email}` });
    // return res.json({ message: "OTP generated and sent"});
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
