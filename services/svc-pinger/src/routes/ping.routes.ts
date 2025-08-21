import { Router } from "express";
import { pingController } from "../controllers/ping.controller";
import { pingMiddleware } from "../middlewares/ping.middleware";
import { ipv4Props } from "../schemes/ip.scheme";
import { urlProps } from "../schemes/url.scheme";

export const pingRouter = Router();

pingRouter.get("/url/:address", pingMiddleware(urlProps), pingController);
pingRouter.get("/ip/:address", pingMiddleware(ipv4Props), pingController);
