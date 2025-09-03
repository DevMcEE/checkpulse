import { Router } from 'express';
import { createPingSetupController } from '../controllers/ping-setups/create.controller';
import { deletePingSetupController } from '../controllers/ping-setups/delete.controller';
import { getAllPingSetupController } from '../controllers/ping-setups/getAll.controller';
import { getByIdPingSetupController } from '../controllers/ping-setups/getByid.controller';
import { updatePingSetupController } from '../controllers/ping-setups/update.controller';
import { requireUserUuid } from '../middlewares/userUuid.middleware';
import { validateRequestBody } from '../middlewares/validate-request';
import { pingSetupBodyScheme } from '../schemas/pingSetup/pingSetup.scheme';

export const pingSetupsRouter = Router();

pingSetupsRouter.get('/', requireUserUuid, getAllPingSetupController);
pingSetupsRouter.post(
  '/',
  requireUserUuid,
  validateRequestBody(pingSetupBodyScheme),
  createPingSetupController,
);
pingSetupsRouter.get('/:id', requireUserUuid, getByIdPingSetupController);
pingSetupsRouter.delete('/:id', requireUserUuid, deletePingSetupController);
pingSetupsRouter.put(
  '/:id',
  requireUserUuid,
  validateRequestBody(pingSetupBodyScheme),
  updatePingSetupController,
);
