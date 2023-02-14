"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.connect_db = void 0;
const pg_1 = require("pg");
const constants_1 = require("../common/constants");
// **********************************************
/** Acquire a db connection - we use this
 * internally everytime we make a database
 * transaction.
 */
const getConnection = async function () {
    try {
        const pool = new pg_1.Pool({
            host: constants_1.POSTGRES_HOST,
            user: constants_1.POSTGRES_USER,
            password: constants_1.POSTGRES_PASSWORD,
            database: constants_1.ENV.trim() !== 'test' ? constants_1.POSTGRES_DB_NAME : constants_1.POSTGRES_TEST_DB_NAME,
            port: parseInt(constants_1.DB_PORT || '5432')
        });
        const client = await pool.connect();
        return client;
    }
    catch (err) {
        console.log(err);
        return {};
    }
};
// **********************************************
/** Releasing the database client
 */
const releaseClient = async function (client) {
    client.release();
};
// **********************************************
/** Database connection test - we use this once at
 *  the beginning of the program execution to check
 *  that we have a working database connection.
 */
const connect_db = async function () {
    const client = await getConnection();
    if (Object.keys(client).length) {
        console.log('Database Initialized Successfully');
        releaseClient(client);
        return true;
    }
    else {
        console.log('Database Initialization failed');
        return false;
    }
};
exports.connect_db = connect_db;
// implemntation
async function execute(query, params) {
    const client = await getConnection();
    return client
        .query(query, params)
        .then((res) => {
        releaseClient(client);
        if (res.rows.length !== 0) {
            return res.rows;
        }
        else if (res.rows.length === 0 && res.command === 'SELECT') {
            return [
                { message: `${res.command} was successful, but return no results.` }
            ];
        }
        else {
            return [{ message: `${res.command} was successful.` }];
        }
    })
        .catch((err) => {
        if (err.code === '23505') {
            releaseClient(client);
            return [`Error: ${err.message}`];
        }
        else {
            console.log(err);
            releaseClient(client);
            return [{ error: `Error: database operation failed.` }];
        }
    });
}
exports.execute = execute;
