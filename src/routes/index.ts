import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.route('/').get((_, res: Response) => {
  res.send('<h1>hello, world!</h1>');
});

export { router };
