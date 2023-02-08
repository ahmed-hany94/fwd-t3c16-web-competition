"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateQuery = exports.selectOneQuery = exports.selectAllQuery = exports.insertQuery = exports.getConnection = exports.connect_db = void 0;
const pg_1 = require("pg");
const constants_1 = require("../common/constants");
// **********************************************
/** Acquire a db connection - we use this internally
 * everytime we make a database transaction.
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
exports.getConnection = getConnection;
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
// **********************************************
/** Select Query with parameters
 */
const selectOneQuery = async function (query, params) {
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
    }
    catch (err) {
        console.log(err);
    }
};
exports.selectOneQuery = selectOneQuery;
// **********************************************
/** Select Query returning the table contents
 */
const selectAllQuery = async function (query) {
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
    }
    catch (err) {
        console.log(err);
    }
};
exports.selectAllQuery = selectAllQuery;
// **********************************************
/** Insert Query with parameters
 */
const insertQuery = async function (query, params) {
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
            }
            else {
                releaseClient(client);
                return `Insert Failed: ${err.message}`;
            }
        });
    }
    catch (err) {
        return `Insert Failed: ${err}`;
    }
};
exports.insertQuery = insertQuery;
// **********************************************
/** Truncate Query
 */
const truncateQuery = async function (query) {
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
    }
    catch (err) {
        console.log(err);
        return 'Truncation Error';
    }
};
exports.truncateQuery = truncateQuery;
// **********************************************
/** Releasing the database client
 */
const releaseClient = async function (client) {
    client.release();
};
