import { Router } from 'express';

import { createPingSetupController } from '../controllers/ping-setups/create.controller';
import { deletePingSetupController } from '../controllers/ping-setups/delete.controller';
import { getAllPingSetupController } from '../controllers/ping-setups/getAll.controller';
import { getByIdPingSetupController } from '../controllers/ping-setups/getByid.controller';
import { updatePingSetupController } from '../controllers/ping-setups/update.controller';

import { validateRequestBody } from '../middlewares/validate-request';
import { pingSetupBodyScheme } from '../schemas/pingSetup/pingSetup.scheme';

export const pingSetupsRouter = Router();

pingSetupsRouter.get('/', getAllPingSetupController);
pingSetupsRouter.post(
  '/',
  validateRequestBody(pingSetupBodyScheme),
  createPingSetupController,
);
pingSetupsRouter.get('/:id', getByIdPingSetupController);
pingSetupsRouter.delete('/:id', deletePingSetupController);
pingSetupsRouter.put(
  '/:id',
  validateRequestBody(pingSetupBodyScheme),
  updatePingSetupController,
);
