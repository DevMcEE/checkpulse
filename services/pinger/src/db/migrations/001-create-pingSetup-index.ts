import makeConnection, { COLLECTION } from '../conn';

export async function CreatePingSetupsIndex() {
  const db = await makeConnection();
  const collection = db.collection(COLLECTION.pingSetups);

  await collection.createIndex(
    { userUuid: 1, target: 1 },
    { unique: true, name: 'userUuid_target_unique' },
  );
  process.exit(0);
}
