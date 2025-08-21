import path from "node:path";
import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";
import { pingRouter } from "./routes/ping.routes";

config({ path: path.resolve(process.cwd(), ".env") });

const SERVICE_NAME = "pinger";

const app = express();
const PORT = process.env[`SERVICE_${SERVICE_NAME.toUpperCase()}_PORT`] || 3000;

app.use(cors());
app.use("/ping", pingRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Svc-pinger running at http://localhost:${PORT}`);
  });
}

export default app;
