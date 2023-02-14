"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMovie = exports.movieByID = exports.getMovies = exports.getMovie = exports.deleteMovie = exports.createMovie = void 0;
const db_1 = require("../../db");
const Movie_1 = require("../../models/Movie");
const createMovie = async function (req, res) {
    try {
        /* Validate input & Create Movie */
        const movie = (0, Movie_1.Movie)(req.body);
        if (!('name' in movie) && !('release_date' in movie))
            throw new Error(movie);
        const query = 'INSERT INTO "movies" (name, release_date) VALUES ($1, $2);';
        const operationResult = await (0, db_1.execute)(query, [
            movie.name,
            movie.release_date
        ]);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json(operationResult[0]);
    }
    catch (err) {
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
exports.createMovie = createMovie;
const movieByID = async function (req, res, next, movieID) {
    try {
        /* Validate input & Get Movie */
        if (!movieID)
            throw new Error(Movie_1.MovieSchemaError.movieIDMissing);
        const query = 'SELECT *,' +
            ' ' +
            "to_char(movies.release_date, 'yyyy-mm-dd')" +
            ' ' +
            'AS formatted_release_date' +
            ' ' +
            'FROM "movies" WHERE movie_id = $1;';
        const movie = await (0, db_1.execute)(query, [movieID]);
        /* Validate database operation success */
        if (!('movie_id' in movie[0]) &&
            !('email' in movie[0]) &&
            !('release_date' in movie[0]))
            throw new Error(movie[0]);
        /* Pass the movie to the next function */
        res.locals.movie = movie[0];
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                Error: err.message
            });
        }
        else {
            console.log(err);
            return res.status(400).json({
                Error: err
            });
        }
    }
};
exports.movieByID = movieByID;
const getMovies = async function (req, res) {
    try {
        const query = 'SELECT *,' +
            ' ' +
            "to_char(movies.release_date, 'yyyy-mm-dd')" +
            ' ' +
            'AS formatted_release_date' +
            ' ' +
            'FROM "movies";';
        const operationResult = await (0, db_1.execute)(query, []);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json({ movies: operationResult });
    }
    catch (err) {
        console.log(err);
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
exports.getMovies = getMovies;
const getMovie = async function (req, res) {
    res.status(200).json({ movie: res.locals.movie });
};
exports.getMovie = getMovie;
const deleteMovie = async function (req, res) {
    try {
        /* Get the movie passed by movieByID middleware */
        const movie = res.locals.movie;
        const query = 'DELETE FROM "movies" WHERE movie_id = $1;';
        const operationResult = await (0, db_1.execute)(query, [movie.movie_id]);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json(operationResult[0]);
    }
    catch (err) {
        console.log(err);
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
exports.deleteMovie = deleteMovie;
const updateMovie = async function (req, res) {
    try {
        /* Get the user passed by userByID middleware */
        const movie = res.locals.movie;
        /* Loop over the movie's attributes and build the query incrementally */
        /* We do this as this input is not constant everytime */
        /* Example: */
        /* Input 1: UPDATE movies SET name = $1 WHERE movie_id = $2 */
        /* Input 2: UPDATE movies SET release_date = $1 WHERE movie_id = $2 */
        /* Input 3: UPDATE movies SET name = $1, release_date = $2 WHERE movie_id = $3 */
        /* Can be extended for more credentials */
        let query = `UPDATE movies SET `;
        let params = [];
        Object.entries(req.body).forEach(async (entry, index) => {
            switch (entry[0]) {
                case 'name': {
                    query +=
                        index === 0 ? `name = $${index + 1}` : `, name = $${index + 1}`;
                    params.push(entry[1]);
                    break;
                }
                case 'release_date': {
                    query +=
                        index === 0
                            ? `release_date = $${index + 1}`
                            : `, release_date = $${index + 1}`;
                    params.push(entry[1]);
                    break;
                }
                default:
                    res.status(400).json({ message: 'Bad parameter.' });
            }
        });
        query += ` WHERE movie_id = $${params.length + 1}`;
        params.push(movie.movie_id);
        /* Validate database operation success */
        const operationResult = await (0, db_1.execute)(query, params);
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json(operationResult[0]);
    }
    catch (err) {
        console.log(err);
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
exports.updateMovie = updateMovie;
