import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import routes from './routes';
import env from '../config/env';

const app = express();
const ENV = env();
const port = ENV.PORT;

let db = [];

app.use(helmet());
// app.use(bodyParser.urlencoded({extended: true}));

routes(app, db);

app.listen(port, () => {
  console.log('We are live on ' + port);
});
