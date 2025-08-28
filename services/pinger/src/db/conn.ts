import { MongoClient, ServerApiVersion } from 'mongodb';
import { logger } from '@checkpulse/logger';
import { DB_URL } from '../config';

const connectionString = DB_URL || '';

export const COLLECTION = {
  logs: 'pingLog',
  ping: 'ping',
  pingSetups: "pingSetups"
};

export const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



const makeConnection = async () => {
  let conn;
  try {
    conn = await client.connect();
    logger.info(`${process.env.DB_NAME} db Connected`);
  } catch (e) {
    console.error(e);
  }

  return conn?.db(process.env.DB_NAME);
};

export default makeConnection;
