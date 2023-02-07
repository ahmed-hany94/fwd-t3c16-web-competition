// **********************************************
// Node Module Imports
import path from 'path';

// **********************************************
// Package Imports
import dotenv from 'dotenv';

// **********************************************
// PATHS
const ROOT_DIR = path.resolve(__dirname + './../..');

// **********************************************
// ENV
dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB_NAME,
  POSTGRES_TEST_DB_NAME,
  PORT,
  DB_PORT,
  TEST_DB_PORT,
  ENV,
  SALT_ROUNDS,
  JWT_SECRET,
  BCRYPT_SECRET
} = process.env;

// **********************************************
export {
  // ENV Vars
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB_NAME,
  POSTGRES_TEST_DB_NAME,
  PORT,
  DB_PORT,
  TEST_DB_PORT,
  ENV,
  SALT_ROUNDS,
  JWT_SECRET,
  BCRYPT_SECRET,

  // Paths
  ROOT_DIR
};
