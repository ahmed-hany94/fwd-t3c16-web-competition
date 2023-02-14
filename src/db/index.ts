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
/** Acquire a db connection - we use this
 * internally everytime we make a database
 * transaction.
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
/** Releasing the database client
 */
const releaseClient = async function (client: PoolClient) {
  client.release();
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
/** `execute` function will perform parameterized
 * query regardless of whether there are parameters.
 * It accepts a generic structure that will be
 * our Object Schema.
 * It returns data if specified in the query
 * or a message to indicate whether the
 * operation succeeded or failed.
 */

// Overload signatures to accept params or none
async function execute<T>(
  query: string,
  params?: (number | string)[]
): Promise<T[]>;
async function execute<T>(
  query: string,
  params: (number | string)[]
): Promise<T[]>;

// implemntation
async function execute<T>(query: string, params?: (number | string)[]) {
  const client = await getConnection();
  return client
    .query<T[]>(query, params)
    .then((res) => {
      releaseClient(client);

      if (res.rows.length !== 0) {
        return res.rows as T[];
      } else if (res.rows.length === 0 && res.command === 'SELECT') {
        return [
          { message: `${res.command} was successful, but return no results.` }
        ];
      } else {
        return [{ message: `${res.command} was successful.` }];
      }
    })
    .catch((err) => {
      if (err.code === '23505') {
        releaseClient(client);
        return [`Error: ${err.message}`];
      } else {
        console.log(err);
        releaseClient(client);
        return [{ error: `Error: database operation failed.` }];
      }
    });
}

export { connect_db, execute };
