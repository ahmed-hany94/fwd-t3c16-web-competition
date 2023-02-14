import express, { Router } from 'express';
import {
  appendMovieInWatchList,
  createWatchList,
  deleteMovieInWatchList,
  deleteWatchList,
  getMovieInWatchList,
  getWatchList
} from '../services/UserWatchListService';

import {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  movieByID,
  updateMovie
} from './controllers/movieCtrl';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  userByID
} from './controllers/userCtrl';

const router: Router = express.Router();
/**
 *   Routes Declarations
 */

// **********************************************
// Watch List Routes
// **********************************************
router
  .route('/users/:userID/movies')
  .get(getWatchList)
  .post(createWatchList)
  .delete(deleteWatchList);

router
  .route('/users/:userID/movies/:movieID')
  .get(getMovieInWatchList)
  .put(appendMovieInWatchList)
  .delete(deleteMovieInWatchList);

// **********************************************
// User Routes
// **********************************************
router.route('/users').get(getUsers).post(createUser);

router.route('/users/:userID').get(getUser).put(updateUser).delete(deleteUser);

router.param('userID', userByID);

// **********************************************
// Movie Routes
// **********************************************
router.route('/movies').get(getMovies).post(createMovie);

router
  .route('/movies/:movieID')
  .get(getMovie)
  .put(updateMovie)
  .delete(deleteMovie);

router.param('movieID', movieByID);

export { router };
