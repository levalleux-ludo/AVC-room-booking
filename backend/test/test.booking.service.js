const assert = require('assert');

const bookingService = require('../bookings/booking.service');
const test_helper = require('./test_helper')
const roomService = require('../rooms/room.service');

var roomOne;

before((done) => {
    test_helper.drop_bookings(done);
});

async function createRoomIfNotExist(roomName, next) {
    await roomService.getByName('Room One')
    .then(async (room) => {
        if (room) {
            console.log('Room One already exists');
            next(room);
        } else {
            console.log('Create Room One in DB');
            await roomService.create(
                {
                    name: roomName,
                    capacity: 0,
                    rentRateHour: 0,
                    rentRateDay: 0,
                }
            ).then(room => {
                next(room);
            })
        }
    }).catch(async (err) => {
        console.log('Create Room One in DB');
        await roomService.create(
            {
                name: roomName,
                capacity: 0,
                rentRateHour: 0,
                rentRateDay: 0,
            }
        ).then(room => {
            next(room);
        })
    });
}

describe('Test bookingService', () => {
    it('creates a booking for Room One', (done) => {
        createRoomIfNotExist('Room One', (room) => {
            roomOne = room;
            console.log('Room One : ', roomOne);
            const booking = bookingService.create({
                ref: "RH1234",
                date: Date('1978-06-11'),
                startTime: Date('1978-06-11T08:00:00.000Z'),
                duration: 3.5,
                roomId: roomOne._id,
            }).then(() => {
                console.log(booking);
                assert(!booking.isNew);
                done();
            });
        });
    });
    // it('creates a room with same name', (done) => {
    //     assert.rejects(
    //         () => { return bookingService.create({
    //                     name: 'Conference Room',
    //                     capacity: 10,
    //                     rentRateHour: 8,
    //                     rentRateDay: 40,
    //                 });
    //             },
    //             /Room \"(.*)\" is already taken/);
    //     done();
    // });
    // var conference;
    // it('getAll()', (done) => {
    //     bookingService.getAll()
    //         .then((rooms) => {
    //             console.log('rooms=', rooms);
    //             assert(rooms.length === 1);
    //             conference = rooms[0];
    //             done();
    //         });
    // });
    // it('getById()', (done) => {
    //     bookingService.getById(conference._id)
    //         .then((room) => {
    //             assert(room.name === 'Conference Room');
    //             done();
    //         });
    // });
    // it('update()', (done) => {
    //     bookingService.update(conference._id, {
    //         capacity: 10,
    //         rentRateHour: 5
    //     }).then(() => {
    //         bookingService.getById(conference._id)
    //             .then((room) => {
    //                 console.log(room);
    //                 assert(room.name === 'Conference Room');
    //                 assert(room.capacity != 20);
    //                 assert(room.rentRateHour === 5);
    //                 done();
    //             });
    //         });
    // });

});

