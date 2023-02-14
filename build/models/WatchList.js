"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchListSchemaError = exports.WatchList = void 0;
const WatchListSchemaError = {
    movieIDMissing: "Movie's ID is missing",
    userIDMissing: "Watchlist User's ID is missing",
    moviesMissing: 'Movies entries are missing'
};
exports.WatchListSchemaError = WatchListSchemaError;
const WatchList = function (reqBody, user_id) {
    if (!reqBody.movie_id)
        return WatchListSchemaError.movieIDMissing;
    if (!user_id)
        return WatchListSchemaError.userIDMissing;
    return {
        movie_id: reqBody.movie_id,
        user_id: user_id
    };
};
exports.WatchList = WatchList;
