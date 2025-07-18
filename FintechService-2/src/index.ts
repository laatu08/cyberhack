import dotenv from "dotenv";
import express from "express";
import registerRoutes from "./routes/register";
import verifyOtpRoutes from "./routes/verifyOtp";
import dataRoute from "./routes/data"
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:3005',
  credentials: true, // if you're using cookies or authorization headers
}));
app.use(express.json());
app.use("/fintech/register", registerRoutes);
app.use("/fintech/verify-otp", verifyOtpRoutes);
app.use("/fintech/data",dataRoute);

app.get("/health-check", (req, res) => {
  res.json({ message: "Fintech service is healthy" });
});

const PORT = process.env.FINTECH_SERVICE_PORT_2;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`🏧 Fintech service running on port ${PORT}`);
});
