import { Router } from 'express';
import { pingController } from '../controllers/ping/ping.controller';
import { validateRequestParamas } from '../middlewares/validate-request';
import { ipv4Props } from '../schemas/ip.scheme';
import { urlProps } from '../schemas/url.scheme';

export const pingRouter = Router();

pingRouter.get(
  '/url/:address',
  validateRequestParamas(urlProps),
  pingController,
);
pingRouter.get(
  '/ip/:address',
  validateRequestParamas(ipv4Props),
  pingController,
);
