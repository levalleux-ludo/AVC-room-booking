const express = require('express');
const router = express.Router();
const websiteService = require('./website.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;
var request = require('request');

// routes
router.put('/', authorize([Roles.SysAdmin, Roles.AvcAdmin]), update);
router.get('/', get);
router.get('/background', getBackground);

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

function getBackground(req, res, next) {
    websiteService.getBackgroundURL().then((url) => {
        req.pipe(request(url)).pipe(res);
    }).catch(() => {
        res.sendFile('room-booking.png');
    });
}