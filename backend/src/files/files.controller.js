const express = require('express');
const router = express.Router();
const fileService = require('./files.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;

const formDataField = fileService.filePrefix;

// routes
router.post('/upload', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), fileService.multer_upload().single(formDataField), fileService.after_upload);
router.delete('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), _delete);
router.get('/:id', getById);

module.exports = router;

function getById(req, res, next) {
    fileService.getFile(req.params.id)
        .then(extra => extra ? res.json(extra) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    fileService.deleteFile(req.params.id);
    res.json({});
}