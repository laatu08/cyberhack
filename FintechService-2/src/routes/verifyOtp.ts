import express from "express";
import axios from "axios";
import { APP_ID } from "../config";
import { fintechUsers } from "../data/user";

import dotenv from "dotenv";
dotenv.config();

const BANK_SERVICE_URL = process.env.BANK_SERVICE_URL

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Missing email or otp" });

  try {
    const response = await axios.post(`${BANK_SERVICE_URL}/bank/verify-otp`, {
      email,
      otp,
      appId: APP_ID,
    });

    if (response.data.status === "success") {
      fintechUsers.push({ email, registeredAt: new Date() });
      return res.json({ message: "User registered successfully" });
    } else {
      return res.status(403).json({ message: response.data.reason });
    }
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ message: err?.response?.data?.message || "Verification failed" });
  }
});

export default router;
