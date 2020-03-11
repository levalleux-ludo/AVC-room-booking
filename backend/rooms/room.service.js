const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Room = db.Room;
const Extra = db.Extra;

module.exports = {
    create,
    update,
    delete: _delete,
    getAll,
    getById,
    getByName,
    getName,
    getImages,
    cleanUndefinedRefs,
    onDeleteExtra
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

async function getName(roomId) {
    // await Room.findById(roomId).then((room) => { console.log("getName " + roomId + " -> " + room.name ); return room.name; } );
    room = await Room.findById(roomId);
    console.log("getName " + roomId + " -> " + room.name);
    return room.name;
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
    // TODO: remove all references to this room in other objects: Bookings

    await Room.findByIdAndRemove(id);
}

async function getImages(then, catch_err) {
    await Room.find({}, 'pictures', function(err, rooms) {
        if (err) {
            catch_err(err);
            return;
        }
        let list = new Array();
        rooms.forEach((room) => {
            room.pictures.forEach((picture) => {
                const imageId = picture.toString();
                if (!list.includes(imageId)) {
                    list.push(imageId);
                }
            });
        });
        then(list);
    });
}

async function cleanUndefinedRefs() {
    console.log('Scheduled task roomService.cleanUndefinedRefs');
    await Room.find(async(err, rooms) => {
        if (err) {
            console.error(err);
            return;
        }
        let extras = await Extra.find().select("_id");
        // console.log("get all extras:", extras);
        let extraIds = extras.map(entry => entry._id.toString());
        // console.log("get all extraIds:", extraIds);
        rooms.forEach((room) => {
            // console.log("Look at room", room);
            const extras = Array.from(room.availableExtras);
            let changed = false;
            extras.forEach((extraId) => {
                if (extraIds.indexOf(extraId.toString()) == -1) {
                    console.log("Found undef ref to extra", extraId, "in room", room.name);
                    room.availableExtras.remove(extraId);
                    changed = true;
                }
            })
            if (changed) {
                room.save();
            }
        })
        return;
    });
}

async function onDeleteExtra(removedExtraId) {
    console.log('update rooms after extra deleted', removedExtraId)
    await Room.find(async(err, rooms) => {
        if (err) {
            console.error(err);
            return;
        }
        rooms.forEach((room) => {
            let changed = false;
            if (room.availableExtras.includes(removedExtraId)) {
                room.availableExtras.remove(removedExtraId);
                changed = true;
            }
            if (changed) {
                console.log("room updated", room.name)
                room.save();
            }
        })
        return;
    });
}