const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Booking = db.Booking;

module.exports = {
    create,
    update,
    delete: _delete,
    getAll,
    getById,
    getAllForRoom
};

async function getAll() {
    return await Booking.find();
}

async function getById(id) {
    return await Booking.findById(id);
}

async function getAllForRoom(roomId) {
    return await Booking.find({ roomId: roomId });
}

async function getAllForRoomSameDay(roomId, day) {
    return await Booking.find({ roomId: roomId, date: day });
}

async function create(bookingParam) {
    // TODO don't allow to clash with other bookings of the same room at the same date

    const booking = new Booking(bookingParam);

    // save booking
    await booking.save();
}

async function update(id, bookingParam) {
    const booking = await Booking.findById(id);

    // validate
    if (!booking) throw 'Booking event not found';
  
    // copy userParam properties to user
    Object.assign(booking, bookingParam);

    await booking.save((err, booking) => {
        if (err) return console.error(err);
        return booking;
    });
}

async function _delete(id) {
    await Booking.findByIdAndRemove(id);
}