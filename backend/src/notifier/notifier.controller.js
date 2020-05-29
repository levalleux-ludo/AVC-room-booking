const express = require('express');
const router = express.Router();
const notifierService = require('./notifier.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;
var request = require('request');

// routes
router.put('/', authorize([Roles.SysAdmin, Roles.AvcAdmin]), update);
router.get('/', get);
router.post('/booking/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff, Roles.Customer]), notifyBooking);

module.exports = router;

function get(req, res, next) {
    notifierService.get()
        .then(extras => res.json(extras))
        .catch(err => next(err));
}

function update(req, res, next) {
    notifierService.update(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function notifyBooking(req, res, next) {
    notifierService.notifyBooking(req.params.id, req.params.event)
        .then(() => res.json({}))
        .catch(err => next(err));
}