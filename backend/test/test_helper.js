const config = require('../config.json');
const mongoose = require('mongoose');

// tell mongoode to use es6 implementation of promises
// mongoose.Promise = global.Promise;

// mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });

// mongoose.connection
//     .once('open', () => console.log('Connected!'))
//     .on('error', (error) => {
//         console.warn('Error : ', error);
//     });

const db = require('../_helpers/db');

module.exports = {
    drop_rooms,
    drop_users,
    drop_bookings
};

before(async(done) => {
    // await db.connect();
    done();
});

let users_dropped = false;

async function drop_users(done) {
    if (users_dropped) {
        done();
        return;
    }
    console.log("Dropping Users ...");
    await db.User.deleteMany({});
    console.log("Users dropped");
    users_dropped = true;
    done();
    // if (db.users) {
    //     await db.users.drop(
    //         (err) => {
    //             if (err) throw(err);
    //             console.log("Users dropped");
    //             // this function runs after the drop is completed
    //             done(); // go ahead everything is done now
    //     });
    // } else done();
    // mongoose.connection.db.listCollections({name: 'users'})
    //     .next(function(err, collinfo) {
    //         db.users.drop(
    //             (err) => {
    //                 if (err) throw(err);
    //                 console.log("Users dropped");
    //                 // this function runs after the drop is completed
    //                 done(); // go ahead everything is done now
    //         });    
    //     });
}
async function drop_rooms(done) {
    console.log("Dropping Rooms ...");
    await db.Room.deleteMany({});
    console.log("Rooms dropped");
    done();
    // if (db.rooms) {
    //     await db.rooms.drop(
    //         (err) => {
    //             if (err) throw(err);
    //             console.log("Rooms dropped");
    //             // this function runs after the drop is completed
    //             done(); // go ahead everything is done now
    //     });
    // } else done();
    // mongoose.connection.db.listCollections({name: 'rooms'})
    //     .next(function(err, collinfo) {
    //         db.rooms.drop(
    //             (err) => {
    //                 if (err) throw(err);
    //                 console.log("Rooms dropped");
    //                 // this function runs after the drop is completed
    //                 done(); // go ahead everything is done now
    //         });    
    //     });
}

async function drop_bookings(done) {
    console.log("Dropping Bookings ...");
    await db.Booking.deleteMany({});
    console.log("Bookings dropped");
    done();
}