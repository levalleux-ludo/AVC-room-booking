const fs = require('fs');
const config = require('../config.json');
const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');
const aws_s3 = require('../files/aws_s3');
const db = require('../_helpers/db');
const Room = db.Room;
const roomService = require('../rooms/room.service');
const websiteService = require('../website/website.service');
const filesService = require('../files/files.service');

const filePrefix = 'image';

module.exports = {
    multer_upload,
    upload,
    after_upload,
    deleteImage,
    getImage,
    setUploadsFolder,
    getAllImages,
    removeUnusedImages,
    filePrefix
}

const imagesMap = new Map();

async function getAllImages(then, catch_err) {
    return filesService.getAllFiles(filePrefix, then, catch_err);
}

function multer_upload() {
    return filesService.multer_upload();
}


function upload(filename) {
    return (req, res, next) => {
        return multer_upload.single(filename);
    }
}

function after_upload(req, res) {
    filesService.after_upload(req, res);
    // imagesMap.set(imageId, encodeURI(req.file.path.replace(/\\/g, '/')));
    // res.send(imageId);
}

function deleteImage(imageId, then, catch_err) {
    return filesService.deleteFile(imageId, then, catch_err);
}

async function getImage(imageId) {
    return filesService.getFile(imageId);
}

function setUploadsFolder(path) {
    uploadsFolder = path;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

async function removeUnusedImages() {
    console.log('Scheduled task imageService.removeUnusedImages');
    await getAllImages(async(list) => {
        let usedPictures = {};

        // Check used pictures in ROOMS collection
        let rooms = await roomService.getAll();
        rooms.forEach(room => {
            let newPictures = room.pictures.filter(pic => {
                // console.log('image', pic, "is used for room", room.name)
                // filter to avoid duplicates
                return usedPictures.hasOwnProperty(pic) ? false : (usedPictures[pic] = true)
            });
        });

        // Check used pictures in WEBSITE config
        let website = await websiteService.get();
        website.pictures.filter(pic => {
            // filter to avoid duplicates
            return usedPictures.hasOwnProperty(pic) ? false : (usedPictures[pic] = true)
        });
        [website.backgroundPicture].filter(pic => {
            // filter to avoid duplicates
            return usedPictures.hasOwnProperty(pic) ? false : (usedPictures[pic] = true)
        });

        list.forEach(async(imageId) => {
            // console.log('check image', imageId)
            if (!usedPictures.hasOwnProperty(imageId)) {
                console.log("this image is not used in Rooms:", imageId)
                await deleteImage(imageId, () => {}, (err) => console.error(err));
            }
        });
    }, (err) => {
        console.error(err);
    });
}