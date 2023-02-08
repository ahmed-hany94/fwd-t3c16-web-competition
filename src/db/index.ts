import { Pool, PoolClient, PoolConfig } from 'pg';

import {
  DB_PORT,
  POSTGRES_DB_NAME,
  POSTGRES_TEST_DB_NAME,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  ENV
} from '../common/constants';

// **********************************************
/** Acquire a db connection - we use this internally
 * everytime we make a database transaction.
 */
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

// **********************************************
/** Database connection test - we use this once at
 *  the beginning of the program execution to check
 *  that we have a working database connection.
 */
const connect_db = async function (): Promise<boolean> {
  const client = await getConnection();
  if (Object.keys(client).length) {
    console.log('Database Initialized Successfully');
    releaseClient(client);
    return true;
  } else {
    console.log('Database Initialization failed');
    return false;
  }
};

// **********************************************
/** Select Query with parameters
 */
const selectOneQuery = async function (query: string, params: string[]) {
  try {
    const client = await getConnection();
    return client
      .query(query, params)
      .then((res) => {
        const rows = res.rows;

        if (rows.length === 0)
          throw Error('Select is successful but results are empty');

        releaseClient(client);
        return rows[0];
      })
      .catch((err) => {
        console.log(err);
        releaseClient(client);
      });
  } catch (err) {
    console.log(err);
  }
};

// **********************************************
/** Select Query returning the table contents
 */
const selectAllQuery = async function (query: string) {
  try {
    const client = await getConnection();
    return client
      .query(query)
      .then((res) => {
        const rows = res.rows;

        if (rows.length === 0)
          throw Error('Select is successful but results are empty');

        releaseClient(client);
        return rows;
      })
      .catch((err) => {
        console.log(err);
        releaseClient(client);
      });
  } catch (err) {
    console.log(err);
  }
};

// **********************************************
/** Insert Query with parameters
 */
const insertQuery = async function (
  query: string,
  params: string[]
): Promise<string> {
  try {
    const client = await getConnection();
    return client
      .query(query, params)
      .then(() => {
        releaseClient(client);
        return 'Insert was successful';
      })
      .catch((err) => {
        if (err.code === '23505') {
          releaseClient(client);
          return `Insert Failed - Unique Violation: ${err.message}`;
        } else {
          releaseClient(client);
          return `Insert Failed: ${err.message}`;
        }
      });
  } catch (err) {
    return `Insert Failed: ${err}`;
  }
};

// **********************************************
/** Truncate Query
 */
const truncateQuery = async function (query: string): Promise<string> {
  try {
    const client = await getConnection();
    return client
      .query(query)
      .then(() => {
        releaseClient(client);
        return 'Truncation Success';
      })
      .catch((err) => {
        console.log(err.message);
        releaseClient(client);
        return 'Truncation Error';
      });
  } catch (err) {
    console.log(err);
    return 'Truncation Error';
  }
};

// **********************************************
/** Releasing the database client
 */
const releaseClient = async function (client: PoolClient) {
  client.release();
};

export {
  connect_db,
  getConnection,
  insertQuery,
  selectAllQuery,
  selectOneQuery,
  truncateQuery
};
