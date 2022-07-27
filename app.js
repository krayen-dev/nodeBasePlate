const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const winston = require('winston');
const router = express.Router();

const routes = require('./app_config/router');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'token');
    res.setHeader('Access-Control-Expose-Headers', 'token');
    next();
});

app.use(express.json());
app.use(morgan("dev"));


// // app.use(morgan('combined', { stream: winston.stream }))
// app.use(function (req, res, err, next) {
//   // add this line to include winston logging
//   winston.error(
//     `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method
//     } - ${req.ip}`,
//   );
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept",
//   );
//   next();
// });

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use(cors());
app.use('/api', routes);

module.exports = app;
