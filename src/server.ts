import express, { Express, json } from 'express';
import { PORT } from './common/constants';
import { connect_db } from './db';
import { router } from './routes';

// **********************************************
// Connect to database
(async function () {
  if ((await connect_db()) === false) {
    process.exit(process.exitCode);
  }
})();

// **********************************************
// Setup express server
const app: Express = express();

// **********************************************
// Setup express middleware
app.use(json());

// **********************************************
// Setup express router
app.use('/api', router);

// **********************************************
// Express Server Listen
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`);
});

export { app };
