const express = require('express');
const router = express.Router();
const bookingsConfigService = require('./bookings-config.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;

// routes
router.put('/', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), update);
router.get('/', get);

module.exports = router;

function get(req, res, next) {
    bookingsConfigService.get()
        .then(bookingsConfigs => res.json(bookingsConfigs))
        .catch(err => next(err));
}

function update(req, res, next) {
    bookingsConfigService.update(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}