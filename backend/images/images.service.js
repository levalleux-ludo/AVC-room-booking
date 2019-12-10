const fs = require('fs');
const config = require('../config.json');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const aws_s3 = require('./aws_s3');

module.exports = {
    multer_upload,
    upload,
    after_upload,
    deleteImage,
    getImage,
    setUploadsFolder
}

const imagesMap = new Map();

var uploadsFolder = config.uploadsFolder;

function multer_upload() {
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, uploadsFolder);
        },
        // By default, multer removes file extensions so let's add them back
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    return multer({ storage: storage });
}


function upload(filename) {
    return (req, res, next) => {
        return multer_upload.single(filename);
    }
}

function after_upload(req, res) {
    if (req.fileValidationError) {
        res.send(req.fileValidationError);
        // return next(req.fileValidationError);
    } else if (!req.file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        res.send(error);
        // return next(error);
    }
    console.log("successfully uploaded file", req.file.path);
    let imageId = uuid();
    let path = req.file.path;
    // Upload to AWS S3
    aws_s3.storeImage(imageId, path, (url) => {
        imagesMap.set(imageId, url);
        try {
            fs.unlinkSync(path)
                //file removed
        } catch (err) {
            console.error(err)
        }
        res.send(imageId);
    }, (err) => {
        res.send(err);
    });
    // imagesMap.set(imageId, encodeURI(req.file.path.replace(/\\/g, '/')));
    // res.send(imageId);
}

function deleteImage(imageId, then, catch_err) {
    console.log("deleting image with id=", imageId);
    aws_s3.deleteImage(imageId, () => {
        then();
    }, (err) => {
        catch_err(err);
    });
}

function getImage(imageId) {
    return { url: imagesMap.get(imageId) };
}

function setUploadsFolder(path) {
    uploadsFolder = path;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}