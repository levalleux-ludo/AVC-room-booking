const fs = require('fs-extra'); // use of fs-extra instead of fs to get remove not empty directory 
const path = require('path');
const chai = require('chai');
const should = chai.should();
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const jwt_helper = require('../_helpers/jwt');
chai.use(require('chai-http'));
chai.use(require('chai-fs'));

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}

describe('image manager local', () => {
    let server;
    let imageId;
    let imageService;
    let url;
    const id = require('mongoose').Types.ObjectId();
    const token = jwt.sign({ sub: id }, config.secret);

    before(function() {
        jwt_helper.deactivateForTest(true);
        imageService = requireUncached('../images/images.service');
        const uploadsFolder = config.testUploadsFolder;
        if (fs.existsSync(uploadsFolder)) {
            fs.removeSync(uploadsFolder);
        }
        imageService.setUploadsFolder(uploadsFolder);
        server = requireUncached('../server');
    })

    it('upload image (http request)', (done) => {
        chai.request(server)
            .post('/images/upload?filename=hello-world.txt')
            .set("Authorization", "Bearer " + token)
            .field('Content-Type', 'multipart/form-data')
            .attach('image', path.join(__dirname, 'image.txt'))
            .end((err, res) => {
                res.should.have.status(200);
                imageId = res.text;
                done();
            });
    }).timeout(15000);

    it('get image from id (direct call)', (done) => {
        url = imageService.getImage(imageId);
        console.log(url);
        chai.request(url.url).get('').end((err, res) => {
            if (err) {
                console.error(err);
                false.should.be.true;
            }
            res.should.have.status(200);
            done();
        });
    }).timeout(15000);


    it('get image from id (http request)', (done) => {
        chai.request(server)
            .get('/images/' + imageId)
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                res.should.have.status(200);
                let url_bis = JSON.parse(res.text);
                // console.log(url_bis.url + ' and ' + url.url + ' should be equal');
                (url_bis.url === url.url).should.be.true;
                chai.request(url_bis.url).get('').end((err, res) => {
                    if (err) {
                        console.error(err);
                        false.should.be.true;
                    }
                    res.should.have.status(200);
                    done();
                });
            });
    }).timeout(15000);

    it('delete image from id (direct call)', (done) => {
        let url_bis = imageService.getImage(imageId);
        imageService.deleteImage(imageId, () => {
            chai.request(url_bis.url).get('').end((err, res) => {
                if (err) {
                    console.error(err);
                    false.should.be.true;
                }
                res.should.have.status(404);
                done();
            });
        }, (err) => {
            console.error(err);
            false.should.be.true;
        });
    }).timeout(15000);
});