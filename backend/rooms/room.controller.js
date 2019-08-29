const express = require('express');
const router = express.Router();
const roomService = require('./room.service');

// routes
router.post('/create', create);
router.put('/:id', update);
router.delete('/:id', _delete);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;

function create(req, res, next) {
    roomService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    roomService.getAll()
        .then(rooms => res.json(rooms))
        .catch(err => next(err));
}

function getById(req, res, next) {
    roomService.getById(req.params.id)
        .then(room => room ? res.json(room) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    roomService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    roomService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}