const assert = require('assert');

const bookingsConfigService = require('../src/bookings-config/bookings-config.service');
const test_helper = require('./test_helper')

// before((done) => {
// bookingsConfigService.reset().then(done());
// });

describe('Test bookingsConfigService', () => {
    it('check default values', (done) => {
        bookingsConfigService.reset().then(() => {
            bookingsConfigService.get().then((bookingsConfig) => {
                assert(bookingsConfig.startTime === 7.5);
                assert(bookingsConfig.endTime === 17.5);
                done();
            });
        });
    });
    it('change values', (done) => {
        const newStartTime = 8.5;
        const newEndTime = 19;
        bookingsConfigService.update({
            startTime: newStartTime,
            endTime: newEndTime
        }).then(() => {
            bookingsConfigService.get().then((bookingsConfig) => {
                assert(bookingsConfig.startTime === newStartTime);
                assert(bookingsConfig.endTime === newEndTime);
                done();
            });
        })
    });
});