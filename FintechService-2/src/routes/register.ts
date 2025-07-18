import express from "express";
import axios from "axios";
// import { BANK_SERVICE_URL } from "../config";
import dotenv from "dotenv";
dotenv.config();

const BANK_SERVICE_URL = process.env.BANK_SERVICE_URL

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "email is required" });

  try {
    const bankResponse=await axios.post(`${BANK_SERVICE_URL}/bank/initiate-registration`, {
      email,
    });
    console.log(`Registration initiated for ${email}`);
    console.log(bankResponse);
    return res
      .status(bankResponse.status)
      .json({ message: bankResponse.data.message });
  } catch (err: any) {
    console.log("Error initiating registration:", err);
    return res.status(err.status || 500).json({ message: err?.response?.data?.message || "Failed to contact bank" });
  }
});

export default router;
