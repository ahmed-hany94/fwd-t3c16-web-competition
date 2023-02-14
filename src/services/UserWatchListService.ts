import { Request, Response } from 'express';

import { execute } from '../db';
import {
  WatchList,
  WatchListSchema,
  WatchListSchemaError
} from '../models/WatchList';

const createWatchList = async function (req: Request, res: Response) {
  try {
    /* Validate input & Create User */
    if (!req.body.movies || req.body.movies.length === 0)
      throw new Error(WatchListSchemaError.moviesMissing);
    /* Get the user passed by userByID middleware */
    const user = res.locals.profile;

    /* Loop over the movie entries to build the database query  */
    let query = 'INSERT INTO "watch_list" (user_id, movie_id) VALUES';
    let movieIDParams: string[] = [];
    movieIDParams.push(user.user_id);
    query += ' ';
    for (let i = 0; i < req.body.movies.length; i++) {
      const movie = WatchList(req.body.movies[i], user.user_id);
      if (!('movie_id' in movie) && !('user_id' in movie))
        throw new Error(movie);

      movieIDParams.push(movie.movie_id);
      query += '(';
      query += `$1`;
      query += `, `;
      query += `$${i + 2}`;
      query += ')';

      if (i !== req.body.movies.length - 1) query += ', ';
    }
    query += ';';

    const operationResult = await execute<WatchListSchema>(
      query,
      movieIDParams
    );

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json(operationResult[0]);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({
        Error: err.message
      });
    else {
      console.log(err);
      res.status(400).json({
        Error: err
      });
    }
  }
};

const getWatchList = async function (req: Request, res: Response) {
  try {
    /* Get the user passed by userByID middleware */
    const user = res.locals.profile;

    const query =
      "SELECT email, name, to_char(m.release_date, 'yyyy-mm-dd')" +
      ' ' +
      'AS formatted_release_date' +
      ' ' +
      'FROM users AS u JOIN watch_list as w' +
      ' ' +
      'ON u.user_id = w.user_id' +
      ' ' +
      'JOIN movies AS m' +
      ' ' +
      'ON w.movie_id = m.movie_id' +
      ' ' +
      'WHERE u.user_id = $1' +
      ';';

    const operationResult = await execute<WatchListSchema>(query, [
      user.user_id
    ]);

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json({
      watchList: operationResult
    });
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({
        Error: err.message
      });
    else {
      console.log(err);
      res.status(400).json({
        Error: err
      });
    }
  }
};

const getMovieInWatchList = async function (req: Request, res: Response) {
  try {
    const user = res.locals.profile;
    const movie = res.locals.movie;

    const query =
      "SELECT name, to_char(m.release_date, 'yyyy-mm-dd')" +
      ' ' +
      'AS formatted_release_date' +
      ' ' +
      'FROM users AS u JOIN watch_list as w' +
      ' ' +
      'ON u.user_id = w.user_id' +
      ' ' +
      'JOIN movies AS m' +
      ' ' +
      'ON w.movie_id = m.movie_id' +
      ' ' +
      'WHERE u.user_id = $1' +
      ' ' +
      'and m.movie_id = $2' +
      ';';

    const operationResult = await execute<WatchListSchema>(query, [
      user.user_id,
      movie.movie_id
    ]);

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json({ watchList: operationResult[0] });
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({
        Error: err.message
      });
    else {
      console.log(err);
      res.status(400).json({
        Error: err
      });
    }
  }
};

const appendMovieInWatchList = async function (req: Request, res: Response) {
  try {
    const user = res.locals.profile;
    const movie = res.locals.movie;

    let query =
      'SELECT * from "watch_list" WHERE user_id = $1 and movie_id = $2';
    let operationResult = await execute<WatchListSchema>(query, [
      user.user_id,
      movie.movie_id
    ]);

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    if ('message' in operationResult[0]) {
      query = 'INSERT INTO "watch_list" (user_id, movie_id) VALUES ($1, $2);';
      operationResult = await execute<WatchListSchema>(query, [
        user.user_id,
        movie.movie_id
      ]);

      /* Validate database operation success */
      if ('error' in operationResult[0])
        throw new Error(operationResult[0].error as string);

      /* Request ended successfully */
      res.status(200).json(operationResult[0]);
    } else {
      /* Request ended successfully */
      res.status(200).json({ message: "Movie already in User's watch list" });
    }
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({
        Error: err.message
      });
    else {
      console.log(err);
      res.status(400).json({
        Error: err
      });
    }
  }
};

const deleteMovieInWatchList = async function (req: Request, res: Response) {
  try {
    const user = res.locals.profile;
    const movie = res.locals.movie;

    const query =
      'DELETE FROM "watch_list" WHERE user_id = $1 and movie_id = $2';
    const operationResult = await execute<WatchListSchema>(query, [
      user.user_id,
      movie.movie_id
    ]);

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json(operationResult[0]);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({
        Error: err.message
      });
    else {
      console.log(err);
      res.status(400).json({
        Error: err
      });
    }
  }
};

const deleteWatchList = async function (req: Request, res: Response) {
  try {
    const user = res.locals.profile;

    const query = 'DELETE FROM watch_list WHERE user_id = $1;';
    const operationResult = await execute<WatchListSchema>(query, [
      user.user_id
    ]);

    /* Validate database operation success */
    if ('error' in operationResult[0])
      throw new Error(operationResult[0].error as string);

    /* Request ended successfully */
    res.status(200).json(operationResult[0]);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({
        Error: err.message
      });
    else {
      console.log(err);
      res.status(400).json({
        Error: err
      });
    }
  }
};

export {
  appendMovieInWatchList,
  createWatchList,
  deleteWatchList,
  deleteMovieInWatchList,
  getMovieInWatchList,
  getWatchList
};
