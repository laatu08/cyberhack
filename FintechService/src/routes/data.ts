import express from "express";
import axios from "axios";
import { APP_ID, PURPOSE } from "../config";
import dotenv from "dotenv";
dotenv.config();

const BANK_SERVICE_URL = process.env.BANK_SERVICE_URL

const router = express.Router();
// const APP_ID="budget-app"
/**
 * POST /fintech/data
 * {
 *   email: string,
 *   fields: string[],
 * }
 */
router.post("/", async (req, res) => {
  const { email, fields } = req.body;

  if (!email || !Array.isArray(fields)) {
    return res.status(400).json({ message: "Missing or invalid email or fields" });
  }

  try {
    // Step 1: Ask Bank for tokenized data
    const bankRes = await axios.post(`${BANK_SERVICE_URL}/bank/data`, {
      email,
      fields,
      appId:APP_ID,
      purpose: PURPOSE,
    });

    const tokenizedFields = bankRes.data.tokenizedFields;
    console.log(tokenizedFields);
    if (!tokenizedFields || Object.keys(tokenizedFields).length === 0) {
      return res.status(403).json({ message: "No data returned by bank" });
    }

    // Step 2: Detokenize all tokens in a single request
    const detokenRes = await axios.post("http://tokenizer:8963/api/v1/detokenize", {
      tokens: tokenizedFields,
      appId:APP_ID,
    });
    console.log(detokenRes);

    // Step 3: Return final detokenized data
    return res.json({ data: detokenRes.data });
  } catch (err: any) {
    console.error("Fintech data fetch failed:", err);
    return res.status(500).json({
      message: "Failed to fetch detokenized data",
      error: err?.response?.data || err.message,
    });
  }
});

export default router;