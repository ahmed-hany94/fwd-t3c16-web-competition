"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseClient = exports.getConnection = exports.connect_db = void 0;
const pg_1 = require("pg");
const constants_1 = require("../common/constants");
const getConnection = async function () {
    try {
        const pool = new pg_1.Pool({
            host: constants_1.POSTGRES_HOST,
            user: constants_1.POSTGRES_USER,
            password: constants_1.POSTGRES_PASSWORD,
            database: constants_1.ENV.trim() !== "test" ? constants_1.POSTGRES_DB_NAME : constants_1.POSTGRES_TEST_DB_NAME,
            port: parseInt(constants_1.DB_PORT || "5432"),
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
const connect_db = async function () {
    const client = await getConnection();
    if (Object.keys(client).length) {
        console.log("Database Initialized Successfully");
        client.release();
        return true;
    }
    else {
        console.log("Database Initialization failed");
        return false;
    }
};
exports.connect_db = connect_db;
const releaseClient = async function () {
    const client = await getConnection();
    client.release();
};
exports.releaseClient = releaseClient;
