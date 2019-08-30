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
    getByRef,
    getAllForRoom
};

async function getAll() {
    return await Booking.find();
}

async function getById(id) {
    console.log("getById id=" + id);

    booking = await Booking.findById(id);
    console.log(booking);
    return booking;
}

async function getByRef(ref) {
    return await Booking.findOne({ref: ref});
}

async function getAllForRoom(roomId) {
    return await Booking.find({ roomId: roomId });
}

async function getAllForRoomSameDay(roomId, day) {
    return await Booking.find({ roomId: roomId, date: day });
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

    // endTime is calculated at creation, needs to be updated explicitly
    booking.endTime = date_helper.computeEndingTime(booking.startTime, booking.duration);

    booking.markModified('startTime');
    booking.markModified('endTime');
    booking.markModified('date');

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
    var newStartTime = bookingParam.startTime;
    var newEndTime = date_helper.computeEndingTime(bookingParam.startTime, bookingParam.duration);
    /* an existing booking is in conflict if and only if :
        same room
        && same day
        && it starts before the new ends
        && it ends after the new starts */
    if (existingBooking = await Booking.findOne({ roomId: bookingParam.roomId, date: bookingParam.date, startTime: { $lt: newEndTime }, endTime: { $gt: newStartTime } })) {
        var roomName = await roomService.getName(bookingParam.roomId);
        throw 'Can\'t book the room \'' + roomName + '\' on \'' + displayBookingPeriod(bookingParam.date,newStartTime,newEndTime) + ':\n Conflict with existing booking "' + existingBooking.ref + '" (' + displayBookingPeriod(existingBooking.date, existingBooking.startTime, existingBooking.endTime) + ')';
    }
}

function displayBookingPeriod(day, startTime, endTime) {
    return date_helper.formatDay(day) + '\' from \'' + date_helper.formatHM(startTime) + '\' to \'' + date_helper.formatHM(endTime) + '\'';
}