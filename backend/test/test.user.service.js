const assert = require('assert');

const userService = require('../users/user.service');
const test_helper = require('./test_helper')

before((done) => {
    test_helper.drop_users(done);
});

describe('Creating user', () => {
    it('creates a user', (done) => {
        // assertion is not included in mocha so require assert which was installed along with mocha
        const user = userService.create({
            username: 'lulu',
            password: 'motdepasse',
            firstName: 'Ludovic',
            lastName: 'Levalleux'
        }).then(() => {
            assert(!user.isNew);
            done();
        });

    });
    it('creates a user with same id', (done) => {
        assert.rejects(
            () => { return userService.create({
                        username: 'lulu',
                        password: 'autremotdepasse',
                        firstName: 'Patrick',
                        lastName: 'Chirac'
                    });
                },
                /Username \"(.*)\" is already taken/);
        done();
    });
    it('authenticate an existing user', (done) => {
        userService.authenticate({username: 'lulu', password: 'motdepasse'})
            .then((user) => {
                console.log('user=', user);
                assert(user);
                done();
            });
    });
    it('authenticate an unknown user', (done) => {
        userService.authenticate({username: 'tata', password: 'motdepasse'})
            .then((user) => {
                console.log('user=', user);
                assert(!user);
                done();
            });
    });
    it('use wrong password', (done) => {
        userService.authenticate({username: 'lulu', password: 'mauvaismotdepasse'})
            .then((user) => {
                console.log('user=', user);
                assert(!user);
                done();
            });
    });
    var lulu;
    it('getAll()', (done) => {
        userService.getAll()
            .then((users) => {
                console.log('users=', users);
                assert(users.length === 1);
                lulu = users[0];
                done();
            });
    });
    it('getById()', (done) => {
        userService.getById(lulu._id)
            .then((user) => {
                assert(user.username === 'lulu');
                done();
            });
    });
    it('update()', (done) => {
        userService.update(lulu._id, {
            firstName: "Mickey",
            lastName: "Mouse"
        }).then(() => {
            userService.getById(lulu._id)
                .then((user) => {
                    console.log(user);
                    assert(user.username === 'lulu');
                    assert(user.firstName != 'Ludovic');
                    assert(user.lastName === 'Mouse');
                    done();
                });
            });
    });

});

