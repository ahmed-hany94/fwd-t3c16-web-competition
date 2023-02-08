CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), 
  email VARCHAR(100) UNIQUE NOT NULL, 
  hash VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), 
  name VARCHAR(100) UNIQUE NOT NULL,
  release_date date NOT NULL
);

CREATE TABLE IF NOT EXISTS watch_list (
  watch_list_pkey uuid PRIMARY KEY DEFAULT uuid_generate_v4(), 
  user_id uuid REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(id) ON UPDATE CASCADE
);
