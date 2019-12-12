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
                console.log(res.body);
                imageId = res.body.imageId;
                done();
            });
    }).timeout(15000);

    it('get image from id (direct call)', (done) => {
        imageService.getImage(imageId).then((url) => {
            console.log(url);
            chai.request(url.url).get('').end((err, res) => {
                if (err) {
                    console.error(err);
                    false.should.be.true;
                }
                res.should.have.status(200);
                done();
            });
        });
    }).timeout(15000);


    it('get image from id (http request)', (done) => {
        chai.request(server)
            .get('/images/' + imageId)
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                res.should.have.status(200);
                let url_bis = JSON.parse(res.text);
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
        imageService.getImage(imageId).then((url_bis) => {
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
        })
    }).timeout(15000);

    it('get all images', (done) => {
        imageService.getAllImages((list) => {
            list.forEach((imageId) => console.log("image:", imageId));
            done();
        }, (err) => {
            console.error(err);
        });
    });

    const roomService = require('../rooms/room.service');

    it('get all images in DB', (done) => {
        roomService.getImages((list) => {
            list.forEach((imageId) => console.log("image:", imageId));
            done();
        }, (err) => {
            console.error(err);
        });
    });

    it('remove unused images', (done) => {
        roomService.getImages((listFromDb) => {
            imageService.getAllImages((listFromS3) => {
                let nbToKeep = 0;
                let nbToDelete = 0;
                listFromS3.forEach((imageId) => {
                    if (listFromDb.includes(imageId)) {
                        console.log("image to keep:", imageId)
                        nbToKeep++;
                    } else {
                        imageService.deleteImage(
                            imageId,
                            () => {
                                console.log("image deleted:", imageId)
                            },
                            (err) => {
                                console.error("Error while trying to delete image", imageId, err);
                            }
                        )
                        nbToDelete++;
                    }
                });
                console.log("Nb images to keep:", nbToKeep);
                console.log("Nb images to delete:", nbToDelete);
                done();
            }, (err) => {
                console.error(err);
            });
        }, (err) => {
            console.error(err);
        });
    });

});