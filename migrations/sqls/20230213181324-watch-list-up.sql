CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS watch_list (
  watch_list_pkey uuid PRIMARY KEY DEFAULT uuid_generate_v4(), 
  user_id uuid REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  movie_id uuid REFERENCES movies(movie_id) ON UPDATE CASCADE
);
