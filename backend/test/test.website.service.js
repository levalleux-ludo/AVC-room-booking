const assert = require('assert');

const websiteService = require('../src/website/website.service');
const test_helper = require('./test_helper')

before((done) => {
    websiteService.reset().then(done());
});

describe('Test WebsiteService', () => {
    it('check defaut values', (done) => {
        websiteService.get().then((website) => {
            assert(website.serviceDescription === '[service description]');
            done();
        });
    });
    it('change values', (done) => {
        const newDescription = "new description";
        websiteService.update({
            serviceDescription: newDescription
        }).then(() => {
            websiteService.get().then((website) => {
                assert(website.serviceDescription === newDescription);
                done();
            });
        })
    });
});