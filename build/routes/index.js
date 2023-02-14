"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const UserWatchListService_1 = require("../services/UserWatchListService");
const movieCtrl_1 = require("./controllers/movieCtrl");
const userCtrl_1 = require("./controllers/userCtrl");
const router = express_1.default.Router();
exports.router = router;
/**
 *   Routes Declarations
 */
// **********************************************
// Watch List Routes
// **********************************************
router
    .route('/users/:userID/movies')
    .get(UserWatchListService_1.getWatchList)
    .post(UserWatchListService_1.createWatchList)
    .delete(UserWatchListService_1.deleteWatchList);
router
    .route('/users/:userID/movies/:movieID')
    .get(UserWatchListService_1.getMovieInWatchList)
    .put(UserWatchListService_1.appendMovieInWatchList)
    .delete(UserWatchListService_1.deleteMovieInWatchList);
// **********************************************
// User Routes
// **********************************************
router.route('/users').get(userCtrl_1.getUsers).post(userCtrl_1.createUser);
router.route('/users/:userID').get(userCtrl_1.getUser).put(userCtrl_1.updateUser).delete(userCtrl_1.deleteUser);
router.param('userID', userCtrl_1.userByID);
// **********************************************
// Movie Routes
// **********************************************
router.route('/movies').get(movieCtrl_1.getMovies).post(movieCtrl_1.createMovie);
router
    .route('/movies/:movieID')
    .get(movieCtrl_1.getMovie)
    .put(movieCtrl_1.updateMovie)
    .delete(movieCtrl_1.deleteMovie);
router.param('movieID', movieCtrl_1.movieByID);
