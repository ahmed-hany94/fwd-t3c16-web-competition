"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWatchList = exports.getMovieInWatchList = exports.deleteMovieInWatchList = exports.deleteWatchList = exports.createWatchList = exports.appendMovieInWatchList = void 0;
const db_1 = require("../db");
const WatchList_1 = require("../models/WatchList");
const createWatchList = async function (req, res) {
    try {
        /* Validate input & Create User */
        if (!req.body.movies || req.body.movies.length === 0)
            throw new Error(WatchList_1.WatchListSchemaError.moviesMissing);
        /* Get the user passed by userByID middleware */
        const user = res.locals.profile;
        /* Loop over the movie entries to build the database query  */
        let query = 'INSERT INTO "watch_list" (user_id, movie_id) VALUES';
        let movieIDParams = [];
        movieIDParams.push(user.user_id);
        query += ' ';
        for (let i = 0; i < req.body.movies.length; i++) {
            const movie = (0, WatchList_1.WatchList)(req.body.movies[i], user.user_id);
            if (!('movie_id' in movie) && !('user_id' in movie))
                throw new Error(movie);
            movieIDParams.push(movie.movie_id);
            query += '(';
            query += `$1`;
            query += `, `;
            query += `$${i + 2}`;
            query += ')';
            if (i !== req.body.movies.length - 1)
                query += ', ';
        }
        query += ';';
        const operationResult = await (0, db_1.execute)(query, movieIDParams);
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
exports.createWatchList = createWatchList;
const getWatchList = async function (req, res) {
    try {
        /* Get the user passed by userByID middleware */
        const user = res.locals.profile;
        const query = "SELECT email, name, to_char(m.release_date, 'yyyy-mm-dd')" +
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
        const operationResult = await (0, db_1.execute)(query, [
            user.user_id
        ]);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json({
            watchList: operationResult
        });
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
exports.getWatchList = getWatchList;
const getMovieInWatchList = async function (req, res) {
    try {
        const user = res.locals.profile;
        const movie = res.locals.movie;
        const query = "SELECT name, to_char(m.release_date, 'yyyy-mm-dd')" +
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
        const operationResult = await (0, db_1.execute)(query, [
            user.user_id,
            movie.movie_id
        ]);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        /* Request ended successfully */
        res.status(200).json({ watchList: operationResult[0] });
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
exports.getMovieInWatchList = getMovieInWatchList;
const appendMovieInWatchList = async function (req, res) {
    try {
        const user = res.locals.profile;
        const movie = res.locals.movie;
        let query = 'SELECT * from "watch_list" WHERE user_id = $1 and movie_id = $2';
        let operationResult = await (0, db_1.execute)(query, [
            user.user_id,
            movie.movie_id
        ]);
        /* Validate database operation success */
        if ('error' in operationResult[0])
            throw new Error(operationResult[0].error);
        if ('message' in operationResult[0]) {
            query = 'INSERT INTO "watch_list" (user_id, movie_id) VALUES ($1, $2);';
            operationResult = await (0, db_1.execute)(query, [
                user.user_id,
                movie.movie_id
            ]);
            /* Validate database operation success */
            if ('error' in operationResult[0])
                throw new Error(operationResult[0].error);
            /* Request ended successfully */
            res.status(200).json(operationResult[0]);
        }
        else {
            /* Request ended successfully */
            res.status(200).json({ message: "Movie already in User's watch list" });
        }
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
exports.appendMovieInWatchList = appendMovieInWatchList;
const deleteMovieInWatchList = async function (req, res) {
    try {
        const user = res.locals.profile;
        const movie = res.locals.movie;
        const query = 'DELETE FROM "watch_list" WHERE user_id = $1 and movie_id = $2';
        const operationResult = await (0, db_1.execute)(query, [
            user.user_id,
            movie.movie_id
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
exports.deleteMovieInWatchList = deleteMovieInWatchList;
const deleteWatchList = async function (req, res) {
    try {
        const user = res.locals.profile;
        const query = 'DELETE FROM watch_list WHERE user_id = $1;';
        const operationResult = await (0, db_1.execute)(query, [
            user.user_id
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
exports.deleteWatchList = deleteWatchList;
