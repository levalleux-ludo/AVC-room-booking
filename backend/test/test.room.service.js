const assert = require('assert');

const roomService = require('../rooms/room.service');
const test_helper = require('./test_helper')

before((done) => {
    test_helper.drop_rooms(done);
});


describe('Test RoomService', () => {
    it('creates a room', (done) => {
        const room = roomService.create({
            name: 'Conference Room',
            capacity: 20,
            rentRateHour: 10.5,
            rentRateDay: 50,
            availableExtras: [
                {extra: 'flipchart_paper_pens', defaultRate: 5.5 },
                {extra: 'projector_screen', defaultRate: 5.5},
                {extra: 'refreshment_fullDay', defaultRate: 15.5},
                {extra: 'refreshment_halfDay', defaultRate: 10}
            ]
        }).then(() => {
            console.log(room);
            assert(!room.isNew);
            done();
        });

    });
    it('creates a room with same name', (done) => {
        assert.rejects(
            () => { return roomService.create({
                        name: 'Conference Room',
                        capacity: 10,
                        rentRateHour: 8,
                        rentRateDay: 40,
                    });
                },
                /Room \"(.*)\" is already taken/);
        done();
    });
    var conference;
    it('getAll()', (done) => {
        roomService.getAll()
            .then((rooms) => {
                console.log('rooms=', rooms);
                assert(rooms.length === 1);
                conference = rooms[0];
                done();
            });
    });
    it('getById()', (done) => {
        roomService.getById(conference._id)
            .then((room) => {
                assert(room.name === 'Conference Room');
                done();
            });
    });
    it('update()', (done) => {
        roomService.update(conference._id, {
            capacity: 10,
            rentRateHour: 5
        }).then(() => {
            roomService.getById(conference._id)
                .then((room) => {
                    console.log(room);
                    assert(room.name === 'Conference Room');
                    assert(room.capacity != 20);
                    assert(room.rentRateHour === 5);
                    done();
                });
            });
    });

});

