import express from "express";
import { pingRouter } from "./routes/ping.routes";
import cors from "cors";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";

const app = express();

app.use(cors());

app.use("/ping", pingRouter);

app.use(errorHandlerMiddleware);

export const startServer = (port:number = 3000) => {
  return app.listen(port, () => {
    console.log(`Svc-pinger running at http://localhost:${port}`);
  });
}

export default app;
