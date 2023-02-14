CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS movies (
  movie_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), 
  name VARCHAR(100) UNIQUE NOT NULL,
  release_date date NOT NULL
);