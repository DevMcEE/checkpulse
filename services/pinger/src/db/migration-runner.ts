import makeConnection from './conn';
import { CreatePingSetupsIndex } from './migrations/001-create-pingSetup-index';

const migrationFuncs = [CreatePingSetupsIndex];

async function run() {
  const db = await makeConnection();

  migrationFuncs.forEach((func) => {
    func(db);
  });
}

run();
