const config = require('../config.json');
const mongoose = require('mongoose');

connect();

module.exports = {
    User: require('../users/user.model').model,
    Roles: require('../users/user.model').roles,
    Room: require('../rooms/room.model').model,
    Booking: require('../bookings/booking.model').model,
    Extra: require('../extras/extras.model').model,
    Organization: require('../organizations/organization.model').model,
    getStatus
    // rooms: require('../rooms/room.model').collection,
    // users: require('../users/user.model').collection,
    // db: mongoose.connection,
    // connect: connect
};

let isConnected = false;

async function connect() {
    const dbURI = process.env.MONGODB_URI || config.connectionString;
    const dbOptions = { server: { auto_reconnect: true }, useCreateIndex: true, useNewUrlParser: true };
    mongoose.connect(dbURI, dbOptions);
    mongoose.Promise = global.Promise;

    mongoose.connection
        .on('connecting', function() {
            console.log('connecting to MongoDB...');
        }).on('error', function(error) {
            if (isConnected) {
                console.error('Error in MongoDb connection: ' + error);
            }
            isConnected = false;
            mongoose.disconnect();
        }).on('connected', function() {
            console.log('MongoDB connected!');
            isConnected = true;
        }).once('open', function() {
            console.log('MongoDB connection opened!');
            isConnected = true;
        }).on('reconnected', function() {
            console.log('MongoDB reconnected!');
            isConnected = true;
        }).on('disconnected', function() {
            console.log('MongoDB disconnected!');
            console.log(getStatus());
            isConnected = false;
            mongoose.connect(dbURI, dbOptions);
        });
};

function getStatus() {
    return {
        connected: isConnected,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        user: mongoose.connection.user,
        name: mongoose.connection.name
    }
}