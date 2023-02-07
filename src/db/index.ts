import { Pool, PoolClient, PoolConfig, QueryResult, QueryResultRow } from 'pg';

import {
  DB_PORT,
  POSTGRES_DB_NAME,
  POSTGRES_TEST_DB_NAME,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  ENV
} from '../modules/constants';

const getConnection = async function (): Promise<PoolClient> {
  try {
    const pool = new Pool({
      host: POSTGRES_HOST,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database:
        ENV!.trim() !== 'test' ? POSTGRES_DB_NAME : POSTGRES_TEST_DB_NAME,
      port: parseInt(DB_PORT || '5432')
    } as PoolConfig);

    const client = await pool.connect();
    return client;
  } catch (err) {
    console.log(err);
    return {} as PoolClient;
  }
};

const connect_db = async function (): Promise<Boolean> {
  const client = await getConnection();
  if (Object.keys(client).length) {
    console.log('Database Initialized Successfully');
    client.release();
    return true;
  } else {
    console.log('Database Initialization failed');
    return false;
  }
};

const releaseClient = async function () {
  const client = await getConnection();
  client.release();
};

export { connect_db, getConnection, releaseClient };
