const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Room = db.Room;

module.exports = {
    create,
    update,
    delete: _delete,
    getAll,
    getById,
    getByName
};

async function getAll() {
    return await Room.find();
}

async function getById(id) {
    return await Room.findById(id);
}

async function getByName(name) {
    return await Room.findOne({ name: name });
}
async function create(roomParam) {
    // validate
    if (await Room.findOne({ name: roomParam.name })) {
        console.log('found the room', roomParam.name);
        throw 'A room with the name "' + roomParam.name + '" already exists';
    }

    const room = new Room(roomParam);

    // save room
    await room.save();
    return room;
}

async function update(id, roomParam) {
    const room = await Room.findById(id);

    // validate
    if (!room) throw 'Room not found';
  
    // copy userParam properties to user
    Object.assign(room, roomParam);

    await room.save();
}

async function _delete(id) {
    await Room.findByIdAndRemove(id);
}