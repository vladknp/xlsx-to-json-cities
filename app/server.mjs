import express from 'express';
import helmet from 'helmet';
// import bodyParser from 'body-parser';
import routes from './routes/index.mjs';
import env from '../config/env.mjs';

const app = express();
const ENV = env();
const port = ENV.PORT;

const db = [];

app.use(helmet());
// app.use(bodyParser.urlencoded({extended: true}));

routes(app, db);

app.listen(port, () => {
  global.console.log(
    `We are live on ${port}, NODE_ENV: ${process.env.NODE_ENV}`,
  );
});
