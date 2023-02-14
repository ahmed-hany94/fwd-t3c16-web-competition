import { Request } from 'express';

const WatchListSchemaError = {
  movieIDMissing: "Movie's ID is missing",
  userIDMissing: "Watchlist User's ID is missing",
  moviesMissing: 'Movies entries are missing'
};

type WatchListSchema = {
  watch_list_pkey: string;
  user_id: string;
  email: string;
  hash: string;
  movie_id: string;
  name: string;
  release_date: string;
  formatted_release_date: string;
  message: string;
  error: string;
};

const WatchList = function (reqBody: Request['body'], user_id: string) {
  if (!reqBody.movie_id)
    return WatchListSchemaError.movieIDMissing as unknown as WatchListSchema;
  if (!user_id)
    return WatchListSchemaError.userIDMissing as unknown as WatchListSchema;

  return {
    movie_id: reqBody.movie_id,
    user_id: user_id
  } as WatchListSchema;
};

export { WatchList, WatchListSchema, WatchListSchemaError };
