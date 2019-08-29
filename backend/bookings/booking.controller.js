const express = require('express');
const router = express.Router();
const bookingService = require('./booking.service');

// routes
router.post('/create', create);
router.put('/:id', update);
// TODO : router.put('/cancel/:id', cancel);
router.get('/:id', getById);
router.get('/', getAll);
// TODO : router.get('/:company', getAllForCompany);
router.get('/:room', getAllForRoom);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    bookingService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    bookingService.getAll()
        .then(bookings => res.json(bookings))
        .catch(err => next(err));
}

function getAllForRoom(req, res, next) {
    bookingService.getAllForRoom(req.params.room)
        .then(bookings => res.json(bookings))
        .catch(err => next(err));
}

function getById(req, res, next) {
    bookingService.getById(req.params.id)
        .then(booking => booking ? res.json(booking) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    bookingService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    bookingService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}