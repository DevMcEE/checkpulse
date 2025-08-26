import { Router } from "express";

import { createPingSetupController } from "../controllers/ping-setups/create.controller";
import { getAllPingSetupController } from "../controllers/ping-setups/getAll.controller";
import { getByIdPingSetupController } from "../controllers/ping-setups/getByid.controller";
import { deletePingSetupController } from "../controllers/ping-setups/delete.controller";
import { updatePingSetupController } from "../controllers/ping-setups/update.controller";

import { dataValidationMiddleware } from "../middlewares/ping-setups/dataValidation.middlware";
import { idValidationMiddleware } from "../middlewares/ping-setups/idValidation.middleware";

export const pingSetupsRouter = Router();

pingSetupsRouter.get('/', getAllPingSetupController);
pingSetupsRouter.post('/', dataValidationMiddleware, createPingSetupController);
pingSetupsRouter.get('/:id', idValidationMiddleware, getByIdPingSetupController);
pingSetupsRouter.delete('/:id', idValidationMiddleware, deletePingSetupController);
pingSetupsRouter.put('/:id',
    idValidationMiddleware,
    dataValidationMiddleware,
    updatePingSetupController
);
