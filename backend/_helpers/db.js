const config = require('../config.json');
const mongoose = require('mongoose');

connect();

module.exports = {
    User: require('../users/user.model').model,
    Room: require('../rooms/room.model').model,
    Booking: require('../bookings/booking.model').model,
    Extra: require('../extras/extras.model').model
        // rooms: require('../rooms/room.model').collection,
        // users: require('../users/user.model').collection,
        // db: mongoose.connection,
        // connect: connect
};

async function connect() {
    mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
    mongoose.Promise = global.Promise;

    mongoose.connection
        .once('open', () => console.log('Connected!'))
        .on('error', (error) => {
            console.warn('Error : ', error);
        });
};