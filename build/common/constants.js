"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROOT_DIR = exports.BCRYPT_SECRET = exports.JWT_SECRET = exports.SALT_ROUNDS = exports.ENV = exports.TEST_DB_PORT = exports.DB_PORT = exports.PORT = exports.POSTGRES_TEST_DB_NAME = exports.POSTGRES_DB_NAME = exports.POSTGRES_PASSWORD = exports.POSTGRES_USER = exports.POSTGRES_HOST = void 0;
// **********************************************
// Node Module Imports
const path_1 = __importDefault(require("path"));
// **********************************************
// Package Imports
const dotenv_1 = __importDefault(require("dotenv"));
// **********************************************
// PATHS
const ROOT_DIR = path_1.default.resolve(__dirname + './../..');
exports.ROOT_DIR = ROOT_DIR;
// **********************************************
// ENV
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB_NAME, POSTGRES_TEST_DB_NAME, PORT, DB_PORT, TEST_DB_PORT, ENV, SALT_ROUNDS, JWT_SECRET, BCRYPT_SECRET } = process.env;
exports.POSTGRES_HOST = POSTGRES_HOST;
exports.POSTGRES_USER = POSTGRES_USER;
exports.POSTGRES_PASSWORD = POSTGRES_PASSWORD;
exports.POSTGRES_DB_NAME = POSTGRES_DB_NAME;
exports.POSTGRES_TEST_DB_NAME = POSTGRES_TEST_DB_NAME;
exports.PORT = PORT;
exports.DB_PORT = DB_PORT;
exports.TEST_DB_PORT = TEST_DB_PORT;
exports.ENV = ENV;
exports.SALT_ROUNDS = SALT_ROUNDS;
exports.JWT_SECRET = JWT_SECRET;
exports.BCRYPT_SECRET = BCRYPT_SECRET;
