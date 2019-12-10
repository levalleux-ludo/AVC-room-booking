const express = require('express');
const router = express.Router();
const imageService = require('./images.service');

// routes
router.post('/upload', imageService.multer_upload().single('image'), imageService.after_upload);
router.delete('/:id', _delete);
router.get('/:id', getById);
router.get('/', getAll);

module.exports = router;
module.exports.getImage = getImage;

function getById(req, res, next) {
    res.json(imageService.getImage(req.params.id));
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

function getImage(imageId) {
    return { url: imagesMap.get(imageId) };
}