const express = require('express');
const router = express.Router();
const websiteService = require('./website.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;

// routes
router.put('/', authorize([Roles.SysAdmin, Roles.AvcAdmin]), update);
router.get('/', get);

module.exports = router;

function get(req, res, next) {
    websiteService.get()
        .then(extras => res.json(extras))
        .catch(err => next(err));
}

function update(req, res, next) {
    websiteService.update(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}