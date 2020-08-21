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
router.put('/check', checkConflicts);
router.get('/private', get_organizations_for_user(), getAllPrivateData);
router.get('/private/:id', get_organizations_for_user(), getPrivateData);
router.get('/form/:id', get_organizations_for_user(), getPdfData)
router.get('/cancel', getAllCancellationData);
router.get('/cancel/:id', getCancellationData);
router.get('/recurrence', getAllRecurrencePatterns);
router.post('/recurrence', createRecurrencePattern);
router.get('/recurrence/:id', getRecurrencePatternById);
router.put('/recurrence/:id', updateRecurrencePattern);
router.delete('/recurrence/:id', deleteRecurrencePattern);
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
router.get('/state/:id', getBookingState);
router.post('/:id/cancel', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff, Roles.Customer]), cancelBooking);
router.delete('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin]), _delete);

module.exports = router;

function create(req, res, next) {
    if (Array.isArray(req.body)) {
        bookingService.createMulti(req.body)
            .then(({ bookings, errors }) => {
                // const status = (errors.length > 0) ? 500 : 201;
                status = 201;
                return res.status(status).json({ bookings, errors });
            })
            .catch(err => next(err));
    } else {
        bookingService.createOne(req.body)
            .then(booking => {
                return res.status(201).json(booking);
            })
            .catch(err => next(err));
    }
}

function checkConflicts(req, res, next) {
    if (Array.isArray(req.body)) {
        bookingService.checkConflicts(req.body).then(results => {
                res.json(results);
            })
            .catch(err => next(err));
    } else {
        bookingService.checkConflicts([req.body]).then(results => {
                res.json(results[0]);
            })
            .catch(err => next(err));
    }
}

function getAll(req, res, next) {
    bookingService.getAll(
            cancelled = req.query.cancelled,
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

function getPrivateData(req, res, next) {
    bookingService.getPrivateData(req.params.id, req.orgas).then(privateData => {
            res.json(privateData);
        })
        .catch(err => next(err));
}

function getPdfData(req, res, next) {
    bookingService.getPdfData(req.params.id, req.orgas, true).then(pdfData => {
            res.type('text;charset=ANSI').send(pdfData);
        })
        .catch(err => next(err));
}

function getAllRecurrencePatterns(req, res, next) {
    bookingService.getAllRecurrencePatterns().then((patterns) => {
            res.json(patterns);
        })
        .catch(err => next(err));
}

function getAllCancellationData(req, res, next) {
    bookingService.getAllCancellationData().then((cancellationData) => {
            res.json(cancellationData);
        })
        .catch(err => next(err));
}

function getCancellationData(req, res, next) {
    bookingService.getCancellationDataById(req.params.id).then(cancellationData => {
            res.json(cancellationData);
        })
        .catch(err => next(err));
}

function getRecurrencePatternById(req, res, next) {
    bookingService.getRecurrencePatternById(req.params.id).then((pattern) => {
        pattern ? res.json(pattern) : res.sendStatus(404)
    }).catch(err => next(err));
}

function createRecurrencePattern(req, res, next) {
    bookingService.createRecurrencePattern(req.body)
        .then((pattern) => res.json(pattern))
        .catch(err => next(err));
}

function updateRecurrencePattern(req, res, next) {
    bookingService.updateRecurrencePattern(req.params.id, req.body)
        .then((pattern) => res.json(pattern))
        .catch(err => next(err));
}

function deleteRecurrencePattern(req, res, next) {
    bookingService.deleteRecurrencePattern(
            req.params.id,
            deletePattern = req.query.deletePattern,
            deleteBookings = req.query.deleteBookings,
            startAfter = req.query.startAfter,
            req.query.reason ? req.query.reason : 'unknown',
            req.user.sub)
        .then(() => res.json({}))
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

function getBookingState(req, res, next) {
    bookingService.getBookingState(req.params.id)
        .then(state => state ? res.json(state) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    bookingService.update(req.params.id, req.body)
        .then((booking) => res.json(booking))
        .catch(err => next(err));
}

function cancelBooking(req, res, next) {
    bookingService.cancelBooking(req.params.id, null, req.query.reason ? req.query.reason : 'unknown', req.user.sub)
        .then((booking) => res.json(booking))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    bookingService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}