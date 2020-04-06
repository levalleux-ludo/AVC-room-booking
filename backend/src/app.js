require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const taskScheduler = require('./_support/task-scheduler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/room', require('./rooms/room.controller'));
app.use('/booking', require('./bookings/booking.controller'));
app.use('/extra', require('./extras/extras.controller'));
app.use('/organization', require('./organizations/organization.controller'));
app.get('/', require('./home/home.controller'));
app.use('/images', require('./images/images.controller'));
app.use('/website', require('./website/website.controller'));


app.get('/home', (req, res) => {
    // Return success response
    return res.status(200).json({ "message": "Hello there... Welcome to mock server." });
});

// global error handler
app.use(errorHandler);

module.exports = app;