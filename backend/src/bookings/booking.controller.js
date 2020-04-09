const express = require('express');
const router = express.Router();
const bookingService = require('./booking.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;
const get_organizations_for_user = require('../_helpers/get_organizations_for_user');

// routes
router.post('/create', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff, Roles.Customer]), create);
router.put('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff, Roles.Customer]), update);
// TODO : router.put('/cancel/:id', cancel);
router.get('/private', get_organizations_for_user(), getAllPrivateData);
router.get('/:id', getById);
router.get('/', get_organizations_for_user(), function(req, res, next) {
    if (req.query.ref) return getByRef(req, res, next);
    // if (req.query.roomId) return getAllForRoom(req, res, next);
    if (req.query.id) {
        req.params.id = req.query.id;
        return getById(req, res, next);
    }
    return getAll(req, res, next);
});
// TODO : router.get('/:company', getAllForCompany);
router.delete('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff, Roles.Customer]), _delete);

module.exports = router;

function create(req, res, next) {
    bookingService.create(req.body)
        .then((booking) => res.json(booking))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    bookingService.getAll(
            roomId = req.query.roomId,
            day = req.query.day,
            startBefore = req.query.startBefore,
            startAfter = req.query.startAfter,
            endBefore = req.query.endBefore,
            endAfter = req.query.endAfter
            // dateFrom=req.query.dateFrom,
            // dateTo=req.query.dateTo
        )
        .then(bookings => {
            res.json(bookings);
        })
        .catch(err => next(err));
}

function getAllPrivateData(req, res, next) {
    bookingService.getAllPrivateData(req.orgas).then(privateDatas => {
            res.json(privateDatas);
        })
        .catch(err => next(err));
}

// function getAllForRoom(req, res, next) {
//     bookingService.getAllForRoom(
//         roomId=req.query.roomId,
//         day=req.query.day,
//         dateFrom=req.query.dateFrom,
//         dateTo=req.query.dateTo)
//         .then(bookings => res.json(bookings))
//         .catch(err => next(err));
// }

function getById(req, res, next) {
    bookingService.getById(req.params.id)
        .then(booking => booking ? res.json(booking) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByRef(req, res, next) {
    bookingService.getByRef(req.query.ref)
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