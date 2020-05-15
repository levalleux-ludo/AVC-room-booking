const fs = require('fs');
const config = require('../config.json');
const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');
const aws_s3 = require('./aws_s3');
const db = require('../_helpers/db');
const bookingsConfigService = require('../bookings-config/bookings-config.service');

const filePrefix = 'file';

module.exports = {
    multer_upload,
    upload,
    after_upload,
    deleteFile,
    getFile,
    setUploadsFolder,
    getAllFiles,
    removeUnusedFiles,
    filePrefix
}

const filesMap = new Map();

var uploadsFolder = config.uploadsFolder;

if (process.env.upload_folder) {
    console.log("process.env.upload_folder", process.env.upload_folder);
    try {
        if (!fs.existsSync(process.env.upload_folder)) {
            fs.mkdirSync(process.env.upload_folder);
        }
        uploadsFolder = process.env.upload_folder;
    } catch (e) {}
}

if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
}

async function getAllFiles(prefix, then, catch_err) {
    await aws_s3.getFiles(prefix, (data) => {
        // console.info(data);
        if (data.Contents) {
            let list = new Array();
            data.Contents.forEach((content) => {
                // console.log(content);
                list.push(content.Key);
            });
            then(list);
        } else {
            catch_err("Wrong data format received", data);
        }
    }, (err) => {
        catch_err(err);
    });
}

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
    return multer({
        storage: storage,
        // Required to work on Firebase Cloud Functions
        startProcessing(req, busboy) {
            console.log('start processing');
            if (req.rawBody) { // indicates the request was pre-processed
                busboy.end(req.rawBody)
            } else {
                req.pipe(busboy)
            }
        }
    });
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
        return;
    } else if (!req.file) {
        console.error("after_upload:" + req + " " + res);
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400;
        error.uploadsFolder = uploadsFolder;
        error.folderExists = fs.existsSync(uploadsFolder);
        error.uploadFstat = fs.fstatSync(fs.openSync(uploadsFolder, fs.constants.O_RDONLY));
        res.send(error);
        // return next(error);
        return;
    }
    console.log("successfully uploaded file", req.file.path);
    let fileId = req.file.filename;
    let path = req.file.path;
    // Upload to AWS S3
    aws_s3.storeFile(fileId, path, (url) => {
        filesMap.set(fileId, url);
        try {
            fs.unlinkSync(path)
                //file removed
        } catch (err) {
            console.error(err)
        }
        res.send({ fileId: fileId });
    }, (err) => {
        res.send(err);
    });
}

function deleteFile(fileId, then, catch_err) {
    console.log("deleting file with id=", fileId);
    aws_s3.deleteFile(fileId, () => {
        then();
    }, (err) => {
        catch_err(err);
    });
}

async function getFile(fileId) {
    return await aws_s3.getFile(fileId);
}

function setUploadsFolder(path) {
    uploadsFolder = path;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

async function removeUnusedFiles() {
    console.log('Scheduled task fileService.removeUnusedFiles');
    await getAllFiles(
        filePrefix,
        async(list) => {
            let usedFiles = {};

            // TODO check for unused files in model (Booking-settings and more ?)

            // Check used pictures in ROOMS collection
            let bookingsConfig = await bookingsConfigService.get()
            if (bookingsConfig && bookingsConfig.termsAndConditions && bookingsConfig.termsAndConditions.fileId) {
                const fileId = bookingsConfig.termsAndConditions.fileId;
                usedFiles.hasOwnProperty(fileId) ? false : (usedFiles[fileId] = true)
            }

            list.forEach(async(fileId) => {
                // console.log('check image', imageId)
                if (!usedFiles.hasOwnProperty(fileId)) {
                    console.log("this file is not used in database:", fileId)
                    await deleteFile(fileId, () => {}, (err) => console.error(err));
                }
            });
        }, (err) => {
            console.error(err);
        });
}