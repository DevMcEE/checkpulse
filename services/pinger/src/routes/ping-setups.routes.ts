import { Router } from "express";

import { createPingSetupMiddlware } from "../middlewares/ping-setups/create.middleware";
import { createPingSetupController } from "../controllers/ping-setups/create.controller";

import { getAllPingSetupMiddleware } from "../middlewares/ping-setups/getAll.middleware";
import { getAllPingSetupController } from "../controllers/ping-setups/getAll.controller";

import { getByIdPingSetupMiddleware } from "../middlewares/ping-setups/getById.middleware";
import { getByIdPingSetupController } from "../controllers/ping-setups/getByid.controller";

import { deletePingSetupMiddlware } from "../middlewares/ping-setups/delete.middleware";
import { deletePingSetupController } from "../controllers/ping-setups/delete.controller";

import { updatePingSetupMiddleware } from "../middlewares/ping-setups/update.middleware";
import { updatePingSetupController } from "../controllers/ping-setups/update.controller";

export const pingSetupsRouter = Router();

pingSetupsRouter.get('/', getAllPingSetupMiddleware, getAllPingSetupController);
pingSetupsRouter.post('/', createPingSetupMiddlware, createPingSetupController);
pingSetupsRouter.get('/:id', getByIdPingSetupMiddleware, getByIdPingSetupController);
pingSetupsRouter.delete('/:id', deletePingSetupMiddlware, deletePingSetupController);
pingSetupsRouter.put('/:id', updatePingSetupMiddleware, updatePingSetupController);
