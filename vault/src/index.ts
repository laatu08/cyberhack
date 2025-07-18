import dotenv from "dotenv";
import express from "express";
// import pinoHTTP from "pino-http";
import adminRouter from "./routes/admin.route";
import tokenRouter from "./routes/token.route";
// import logger from "./utils/logger";

dotenv.config();

const app = express();
app.use(express.json());
// app.use(pinoHTTP({ logger })); // logs all HTTP requests

// routes
app.use("/api/v1", tokenRouter);
app.use("/admin", adminRouter);

const port = process.env.VAULT_PORT || 8963;

app.listen(port, () =>
  console.log("Tokenizer service listening on port:", port)
);
