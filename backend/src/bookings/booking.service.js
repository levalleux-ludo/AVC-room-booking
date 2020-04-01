const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Booking = db.Booking;
const date_helper = require('../_helpers/date_helper');
const roomService = require('../rooms/room.service');

module.exports = {
    create,
    update,
    delete: _delete,
    getAll,
    getById,
    getByRef
    // getAllForRoom
};

async function getAll(roomId, day, startBefore, startAfter, endBefore, endAfter) {
    req = {};
    if (roomId)
        req.roomId = roomId;
    if (day) {
        // get only bookings for the same day
        req.startDate = day;
    } else {
        // if (dateFrom && dateTo) {
        //     req.date = { $gte: dateFrom, $lte: dateTo };
        // } else if (dateFrom) {
        //     req.date = { $gte: dateFrom };
        // } else if (dateTo) {
        //     req.date = { $lte: dateTo };
        // }
        // req.startDate = {};
        // if (startBefore) {
        //     req.startDate.$lte = startBefore;
        // }
        // if (startAfter) {
        //     req.startDate.$gte = startAfter;
        // }
        // req.endDate = {};
        // if (endBefore) {
        //     req.endDate.$lte = endBefore;
        // }
        // if (endAfter) {
        //     req.endDate.$gte = endAfter;
        // }
        if (startBefore && startAfter) {
            req.startDate = { $gte: startAfter, $lte: startBefore };
        } else if (startBefore) {
            req.startDate = { $lte: startBefore };
        } else if (startAfter) {
            req.startDate = { $gte: startAfter };
        }
        if (endBefore && endAfter) {
            req.endDate = { $gte: endAfter, $lte: endBefore };
        } else if (endBefore) {
            req.endDate = { $lte: endBefore };
        } else if (endAfter) {
            req.endDate = { $gte: endAfter };
        }
    }
    console.log(`BookingService::getAll() req=${req}`);
    return await Booking.find(req);
}

async function getById(id) {
    console.log(`BookingService::getById() id=${id}`);

    booking = await Booking.findById(id);
    return booking;
}

async function getByRef(ref) {
    return await Booking.findOne({ ref: ref });
}

// async function getAllForRoom(roomId, day, dateFrom, dateTo) {
//     req = { roomId: roomId };
//     if (day) {
//         // get only bookings for the same day
//         req.date = day;
//     }
//     if (dateFrom && dateTo) {
//         req.date = { $gte: dateFrom, $lte: dateTo };
//     } else if (dateFrom) {
//         req.date = { $gte: dateFrom };
//     } else if (dateTo) {
//         req.date = { $lte: dateTo };
//     }
//     console.log(req);
//     return await Booking.find(req);
// }

async function getAllForRoomSameDay(roomId, day) {
    return await Booking.find({ roomId: roomId, startDate: day });
}

async function create(bookingParam) {
    // TODO don't allow to clash with other bookings of the same room at the same date  
    await checkConflict(bookingParam);

    const booking = new Booking(bookingParam);

    // save booking
    return await booking.save();
    // return booking;
}

async function update(id, bookingParam) {
    const booking = await Booking.findById(id);

    console.log("update booking with id" + id);

    // validate
    if (!booking) throw 'Booking event not found';

    // copy userParam properties to user
    Object.assign(booking, bookingParam);

    booking.markModified('startDate');
    booking.markModified('endDate');

    return await booking.save();
    // (err, booking) => {
    //     if (err) return console.error(err);
    //     return booking;
    // });
}

async function _delete(id) {
    await Booking.findByIdAndRemove(id);
}

async function checkConflict(bookingParam) {
    var newStartDate = bookingParam.startDate;
    var newEndDate = bookingParam.endDate;
    /* an existing booking is in conflict if and only if :
        same room
        && it starts before the new ends
        && it ends after the new starts */
    var existingBooking = await Booking.findOne({ roomId: bookingParam.roomId, startDate: { $lt: newEndDate }, endDate: { $gt: newStartDate } },
        function(err, result) {
            if (err) { /* handle err */
                console.error(err);
            }
        });
    if (existingBooking) {
        var roomName = await roomService.getName(bookingParam.roomId);
        throw 'Can\'t book the room \'' + roomName + '\' on \'' + displayBookingPeriod(newStartDate, newEndDate) + ':\n Conflict with existing booking "' + existingBooking.ref + '" (' + displayBookingPeriod(existingBooking.startDate, existingBooking.endDate) + ')';
    }
    console.log("No conflict");
}

function displayBookingPeriod(startDate, endDate) {
    return date_helper.formatDay(startDate) + '\' from \'' + date_helper.formatHM(startDate) + '\' to \'' + date_helper.formatHM(endDate) + '\'';
}