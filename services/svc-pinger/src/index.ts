import express, { Request, Response } from "express";
import fetch from "node-fetch";

export interface PingResult {
    responseCode: number;
    responseTime: number;
  }

const app = express();
const PORT = 3000;

export async function pingResource(url: string, timeoutMs = 5000): Promise<PingResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const start = Date.now();
  try {
    const res = await fetch(url, { signal: controller.signal });
    const responseTime = Date.now() - start;
    clearTimeout(timeout);
    return { responseCode: res.status, responseTime };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      throw new Error("Timeout exceeded");
    }
    throw err;
  }
}

app.get("/ping/:resource", async (req: Request, res: Response) => {
  const { resource } = req.params;
  const timeoutMs = req.query.timeout ? parseInt(req.query.timeout as string) : 5000;

  let url = resource;
  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }

  try {
    const { responseCode, responseTime } = await pingResource(url, timeoutMs);
    if (responseCode >= 200 && responseCode <= 599) {
      res.status(200).json({
        "response-code": responseCode,
        "response-time": responseTime
      });
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(404);
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Svc-pinger running at http://localhost:${PORT}`);
  });
}

export default app;
