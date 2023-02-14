"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieSchemaError = exports.Movie = void 0;
const MovieSchemaError = {
    movieIDMissing: "Movie's ID is missing",
    nameMissing: "Movie's name is missing",
    releaseDateMissing: "Movie's release date is missing"
};
exports.MovieSchemaError = MovieSchemaError;
const Movie = function (reqBody) {
    if (!reqBody.name)
        return MovieSchemaError.nameMissing;
    if (!reqBody.release_date)
        return MovieSchemaError.releaseDateMissing;
    return {
        name: reqBody.name,
        release_date: reqBody.release_date
    };
};
exports.Movie = Movie;
