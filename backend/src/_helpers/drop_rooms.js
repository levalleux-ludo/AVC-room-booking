const config = require('../config.json');
const mongoose = require('mongoose');

// tell mongoode to use es6 implementation of promises
// mongoose.Promise = global.Promise;

// mongoose.connect(process.env.mongodb_uri || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });

// mongoose.connection
//     .once('open', () => console.log('Connected!'))
//     .on('error', (error) => {
//         console.warn('Error : ', error);
//     });

const db = require('./db');

console.log("Dropping Rooms ...");
db.rooms.drop(
    () => { console.log("Rooms dropped"); }
);