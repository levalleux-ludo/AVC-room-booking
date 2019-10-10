const assert = require('assert');
const moment = require('moment');

const bookingService = require('../bookings/booking.service');
const test_helper = require('./test_helper')
const roomService = require('../rooms/room.service');
const date_helper = require('../_helpers/date_helper');

var roomOne;
var roomTwo;
var endOfBooking1;
var idBooking1;

function addToTime(startTime, offsetHours) {
    let res = moment.utc(startTime);
    if (offsetHours > 0) {
        res = res.add(offsetHours, 'hours');
    } else {
        res = res.subtract(-offsetHours, 'hours');
    }
    return new Date(res.utc());
}



booking1 = () => {
    return {
        ref: "RH1234",
        startDate: '1978-06-11T08:00:00.000Z',
        endDate: '1978-06-11T11:30:00.000Z',
        roomId: roomOne._id,
    };
};
booking2 = () => {
    return {
        ref: booking1().ref,
        startDate: '1978-06-11T08:00:00.000Z',
        endDate: '1978-06-11T11:30:00.000Z',
        roomId: roomTwo._id,
    }
};
booking3 = () => {
    return {
        ref: "RH3456",
        // start just after booking1,
        startDate: booking1().endDate,
        endDate: addToTime(booking1().endDate, 1.5),
        roomId: booking1().roomId,
    }
};
booking4 = () => {
    return {
        ref: "RH4567",
        // start during booking1 and end after
        startDate: addToTime(booking1().startDate, 1),
        endDate: addToTime(booking1().endDate, 1),
        roomId: booking1().roomId,
    }
};
booking5 = () => {
    return {
        ref: "RH5678",
        date: booking1().date,
        // start 1h before booking1 but overlap booking1
        startDate: addToTime(booking1().startDate, -1),
        endDate: addToTime(booking1().startDate, 1.5),
        roomId: booking1().roomId,
    }
};
booking6 = () => {
    return {
        ref: "RH6789",
        date: booking3().date,
        // start during booking3 and end before
        startDate: addToTime(booking3().startDate, date_helper.duration(booking3().startDate, booking3().endDate) / 2),
        endDate: addToTime(booking3().startDate, date_helper.duration(booking3().startDate, booking3().endDate) * 3 / 4),
        roomId: booking3().roomId,
    }
};

before((done) => {
    test_helper.drop_bookings(done);
});

async function createRoomIfNotExist(roomName, next) {
    await roomService.getByName(roomName)
        .then(async(room) => {
            if (room) {
                console.log('Room ' + roomName + ' already exists');
                next(room);
            } else {
                console.log('Create Room ' + roomName + ' in DB');
                await roomService.create({
                    name: roomName,
                    capacity: 0,
                    rentRateHour: 0,
                    rentRateDay: 0,
                }).then(room => {
                    next(room);
                })
            }
        }).catch(async(err) => {
            console.error(err);
            throw (err);
        });
}

describe('Test bookingService', () => {
    it('creates a booking for Room One', (done) => {
        createRoomIfNotExist('Room One', (room) => {
            roomOne = room;
            console.log('Room One : ', roomOne);
            p = bookingService.create(booking1()).then((booking) => {
                console.log(booking);
                assert(!p.isNew);
                endOfBooking1 = booking.endTime;
                idBooking1 = booking._id;
                console.log('Booking1 ID = ' + idBooking1);
                done();
            });
        });
    });
    it('creates a booking with same reference', (done) => {
        createRoomIfNotExist('Room Two', (room) => {
            roomTwo = room;
            console.log('Room Two : ', roomTwo);
            assert.rejects(
                    () => { return bookingService.create(booking2()); }, {
                        name: 'MongoError',
                        message: /duplicate key error/
                    })
                .then(() => done(), done);
        });
    });
    it('creates a booking adjacent to another one', (done) => {
        const booking = bookingService.create(booking3()).then(() => {
            console.log(booking);
            assert(!booking.isNew);
            done();
        });
    });
    it('creates a booking in conflict with another one', (done) => {
        assert.rejects(
                () => { return bookingService.create(booking4()); },
                /Conflict with existing booking/)
            .then(() => done(), done);
    });
    it('creates a booking in conflict with another one', (done) => {
        assert.rejects(
                () => { return bookingService.create(booking5()); },
                /Conflict with existing booking/)
            .then(() => done(), done);
    });
    it('creates a booking in conflict with another one', (done) => {
        assert.rejects(
                () => { return bookingService.create(booking6()); },
                /Conflict with existing booking/)
            .then(() => done(), done);
    });
    it('update a booking : move booking1 to another date', (done) => {
        var oldDay = (new Date(booking1().startDate)).getDate();
        var oldDuration = date_helper.duration(booking1().startDate, booking1().endDate);
        bookingService.update(idBooking1, {
            startDate: addToTime(booking1().startDate, 24),
            endDate: addToTime(booking1().endDate, 24)
        }).then(() => {
            bookingService.getById(idBooking1)
                // bookingService.getByRef(booking1().ref)
                .then((booking) => {
                    console.log('Booking1 after update =');
                    console.log(booking);
                    assert(booking.ref === booking1().ref);
                    assert(booking.startDate.getTime() != (new Date(booking1().startDate)).getTime());
                    var newDuration = date_helper.duration(booking.startDate, booking.endDate);
                    assert(oldDuration === newDuration);
                    var newDay = (new Date(booking.startDate)).getDate();
                    assert(newDay === oldDay + 1);
                    done();
                });
        });
    });
});