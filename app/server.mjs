import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
let db = [];

const port = process.env.PORT || 8083;
// const port = 3000;
// const hostname =  '/api';

// app.use(bodyParser.urlencoded({extended: true}));

routes(app, db);

app.listen(port, () => {
  console.log('We are live on ' + port);
});
