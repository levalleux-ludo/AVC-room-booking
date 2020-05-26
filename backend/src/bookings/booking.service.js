const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Booking = db.Booking;
const BookingPrivateData = db.BookingPrivateData;
const RecurrencePattern = db.RecurrencePattern;
const date_helper = require('../_helpers/date_helper');
const roomService = require('../rooms/room.service');
const States = require('./booking.model').states;

module.exports = {
    createOne,
    createMulti,
    update,
    delete: _delete,
    getAll,
    getById,
    getByRef,
    getAllPrivateData,
    getBookingState,
    getAllRecurrencePatterns,
    getRecurrencePatternById,
    createRecurrencePattern,
    updateRecurrencePattern,
    deleteRecurrencePattern,
    cleanUndefinedRefs,
    checkConflict,
    checkConflicts
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

async function getAllPrivateData(organizations) {
    if (organizations === '*') {
        // the user is allowed to see every organization data, return all private data
        return await BookingPrivateData.find();
    }
    return await BookingPrivateData.find().all('organizationId', organizations);
}

async function getById(id) {
    console.log(`BookingService::getById() id=${id}`);

    booking = await Booking.findById(id);
    return booking;
}

async function getPrivateData(id) {
    console.log(`BookingService::getPrivateData() id=${id}`);

    privateData = await BookingPrivateData.findById(id);
    return privateData;
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

async function createOne(bookingParam) {
    await checkConflict(bookingParam);

    const booking = new Booking(bookingParam);

    const privateData = new BookingPrivateData(bookingParam.private);
    await privateData.save();
    booking.privateData = privateData.id;
    // save booking
    return await booking.save();
}

async function createMulti(bookingsParams) {
    const bookings = [];
    const errors = []
    for (let bookingParam of bookingsParams) {
        try {
            bookings.push(await createOne(bookingParam));
        } catch (err) {
            errors.push({ message: `unable to create booking of room ${booking.roomId} at ${booking.startDate}. Reason:${err}` });
        }
    }
    return { bookings, errors };
}

async function update(id, bookingParam) {
    const booking = await Booking.findById(id);
    const privateData = await BookingPrivateData.findById(booking.privateData);

    console.log("update booking with id" + id);

    // validate
    if (!booking) throw 'Booking event not found';

    // copy userParam properties to user
    Object.assign(booking, bookingParam);
    Object.assign(privateData, bookingParam.private);

    booking.markModified('startDate');
    booking.markModified('endDate');

    await privateData.save();
    return await booking.save();
    // (err, booking) => {
    //     if (err) return console.error(err);
    //     return booking;
    // });
}

async function _delete(id) {
    await BookingPrivateData.findByIdAndRemove(booking.privateData);
    await Booking.findByIdAndRemove(id);
}

async function checkConflicts(bookingParams) {
    const results = [];
    for (const bookingParam of bookingParams) {
        try {
            await bookingService.checkConflict(params);
            results.push(false);
        } catch {
            results.push(true);
        }
    }
    return results;
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

async function getBookingState(bookingId) {
    const booking = await getById(bookingId);
    if (!booking) {
        return undefined;
    }
    if (booking.cancelled) {
        return States.Cancelled;
    } else if (booking.startDate > Date.now()) {
        return States.Scheduled;
    } else if (booking.endDate > Date.now()) {
        return States.InProgress;
    } else {
        return States.Completed;
    }
}


async function getAllRecurrencePatterns() {
    return await RecurrencePattern.find();
}

async function getRecurrencePatternById(id) {
    return await RecurrencePattern.findById(id);
}

async function createRecurrencePattern(patternData) {
    const pattern = new RecurrencePattern(patternData);
    return await pattern.save();
}

async function updateRecurrencePattern(id, patternData) {
    const pattern = await RecurrencePattern.findById(id);
    // validate
    if (!pattern) throw 'Pattern not found';
    // copy userParam properties to user
    Object.assign(pattern, patternData);
    return await pattern.save();
}

async function deleteRecurrencePattern(id, deletePattern = true, deleteBookings = false, startAfter = undefined) {

    if (deleteBookings && startAfter) {
        await Booking.deleteMany({ recurrencePatternId: id, startDate: { $gte: startAfter } });
    }
    if (deletePattern === true) {
        console.log('deletePattern', deletePattern);
        // check it is not possible to delete a pattern if some bookings still reference it
        const bookings = await Booking.find({ recurrencePatternId: id });
        if (bookings.length > 0 && !deleteBookings) {
            throw Error("Unable to delete the pattern because some existing bookings still reference it");
        }
        await RecurrencePattern.findByIdAndRemove(id);
    }
}

async function cleanUndefinedRefs() {
    console.log('Scheduled task bookingService.cleanUndefinedRefs');
    await BookingPrivateData.find(async(err, privateDatas) => {
        if (err) {
            console.error(err);
            return;
        }
        privateDatas.forEach(async(privateData) => {
            let bookings = await Booking.find({ privateData: privateData._id }).select("_id");
            if (bookings.length === 0) {
                await BookingPrivateData.findByIdAndRemove(privateData._id);
            }
        });
        return;
    });
    await RecurrencePattern.find(async(err, recurrencePatterns) => {
        if (err) {
            console.error(err);
            return;
        }
        recurrencePatterns.forEach(async(recurrencePattern) => {
            let bookings = await Booking.find({ recurrencePatternId: recurrencePattern._id }).select("_id");
            if (bookings.length === 0) {
                console.log('remove recurrencePattern with id', recurrencePattern._id);
                await RecurrencePattern.findByIdAndRemove(recurrencePattern._id);
            }
        });
        return;
    });
}