import { Db } from 'mongodb';
import { COLLECTION } from '../conn';

export async function CreatePingSetupsIndex(db: Db) {
  const collection = db.collection(COLLECTION.pingSetups);

  await collection.createIndex(
    { userUuid: 1, target: 1 },
    { unique: true, name: 'userUuid_target_unique' },
  );
}
