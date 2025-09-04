import { closeDbConnection } from './conn';
import { CreatePingSetupsIndex } from './migrations/001-create-pingSetup-index';

const migrationFuncs = [CreatePingSetupsIndex];

async function run() {
  migrationFuncs.forEach((func) => {
    func();
  });
}

run().catch((_) => {
  closeDbConnection();
});
