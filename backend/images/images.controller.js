const express = require('express');
const router = express.Router();
const imageService = require('./images.service');
const authorize = require('_helpers/authorize');
const Roles = require('../users/user.model').roles;

// routes
router.post('/upload', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), imageService.multer_upload().single('image'), imageService.after_upload);
router.delete('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), _delete);
router.get('/:id', getById);
router.get('/', getAll);

module.exports = router;

function getById(req, res, next) {
    imageService.getImage(req.params.id)
        .then(extra => extra ? res.json(extra) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    res.json({
        images: [{ url: 'image1' }, { url: 'image2' }]
    });
}

function _delete(req, res, next) {
    imageService.deleteImage(req.params.id);
    res.json({});
}