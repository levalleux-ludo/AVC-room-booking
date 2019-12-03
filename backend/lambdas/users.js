const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('../_helpers/jwt');
const errorHandler = require('../_helpers/error-handler');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// use JWT auth to secure the api
app.use(jwt());
// global error handler
app.use(errorHandler);
// no need to route only /book requests; that's done in now.json
app.use(require('../users/users.controller'));

// just export the app instead of starting up the server
module.exports = app;