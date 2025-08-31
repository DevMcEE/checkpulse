import { logger } from '@checkpulse/logger';
import { type Db, MongoClient, ServerApiVersion } from 'mongodb';
import { DB_URL } from '../config';

const connectionString = DB_URL || '';

export const COLLECTION = {
  logs: 'pingLog',
  ping: 'ping',
  pingSetups: 'pingSetups',
};

export const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let conn: MongoClient;
const makeConnection = async (): Promise<Db> => {
  try {
    conn = await client.connect();
    logger.info(`${process.env.DB_NAME} db Connected`);
  } catch (e) {
    logger.error(e);
  }

  return conn?.db(process.env.DB_NAME);
};

export default makeConnection;

export const closeDbConnection = async () => {
  conn.close();
};
