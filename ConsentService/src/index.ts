import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import { startConsentExpirationJob } from "./jobs/expireConsents.job";
import authRoutes from "./routes/auth.routes";
import consentRoutes from "./routes/consent.routes";
import userRoutes from "./routes/user.routes";
import bankRoutes from "./routes/bank.routes";
// @ts-ignore

dotenv.config();

const app = express();
const port = process.env.CONSENT_SERVICE_PORT || 4000;

// Global middlewares
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json());

app.use("/api", consentRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/bank/user", bankRoutes);

app.get("/", (_req, res) => {
  res.send("Consent Service is running");
});

// Start background job
startConsentExpirationJob();

app.listen(port, () => {
  // console.log('server is running');
  console.log(`Consent Service running on port ${[port]}`);
});
