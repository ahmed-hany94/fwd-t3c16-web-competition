import { Request } from 'express';

const MovieSchemaError = {
  movieIDMissing: "Movie's ID is missing",
  nameMissing: "Movie's name is missing",
  releaseDateMissing: "Movie's release date is missing"
};

type MovieSchema = {
  movie_id: string;
  name: string;
  release_date: string;
  formatted_release_date: string;
  message: string;
  error: string;
};

const Movie = function (reqBody: Request['body']) {
  if (!reqBody.name)
    return MovieSchemaError.nameMissing as unknown as MovieSchema;
  if (!reqBody.release_date)
    return MovieSchemaError.releaseDateMissing as unknown as MovieSchema;

  return {
    name: reqBody.name,
    release_date: reqBody.release_date
  } as MovieSchema;
};

export { Movie, MovieSchema, MovieSchemaError };
