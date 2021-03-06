const assert = require('assert');

const userService = require('../src/users/user.service');
const roomService = require('../src/rooms/room.service');
const imageService = require('../src/images/images.service');
const test_helper = require('./test_helper')

describe('Look for undefined ref in database', () => {
    it('Look for undefined ref in user', (done) => {
        userService.cleanUndefinedRefs().then(() => {
            done();
        });
    });
    it('Look for undefined ref in room', (done) => {
        roomService.cleanUndefinedRefs().then(() => {
            done();
        });
    });
});

describe('Look for unused images in storage', () => {
    it('Look for ununsed images in rooms', (done) => {
        imageService.removeUnusedImages().then(() => {
            done();
        })
    });
});