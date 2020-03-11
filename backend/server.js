﻿require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const taskScheduler = require('_support/task-scheduler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/room', require('./rooms/room.controller'));
app.use('/booking', require('./bookings/booking.controller'));
app.use('/extra', require('./extras/extras.controller'));
app.use('/organization', require('./organizations/organization.controller'));
app.get('/', require('./home/home.controller'));
app.use('/images', require('./images/images.controller'));


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function() {
    console.log('Server listening on port ' + port);
});

module.exports = server; // Required for API testing with chai