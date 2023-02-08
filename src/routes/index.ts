import express, { Router } from 'express';
import { createHello } from './controllers/helloCtrl';

const router: Router = express.Router();

// **********************************************
// Routes Declarations
router.route('/').get(createHello);

export { router };
