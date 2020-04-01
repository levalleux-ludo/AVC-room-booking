const express = require('express');
const router = express.Router();
const extraService = require('./extras.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;

// routes
router.post('/create', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), create);
router.put('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), update);
router.delete('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), _delete);
router.get('/', function(req, res, next) {
    if (req.query.name) return getByName(req, res, next);
    if (req.query.id) {
        req.params.id = req.query.id;
        return getById(req, res, next);
    }
    return getAll(req, res, next);
});
router.get('/:id', getById);

module.exports = router;

function create(req, res, next) {
    extraService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    extraService.getAll()
        .then(extras => res.json(extras))
        .catch(err => next(err));
}

function getById(req, res, next) {
    console.log(`getById(${req.params.id})`);
    extraService.getById(req.params.id)
        .then(extra => extra ? res.json(extra) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByName(req, res, next) {
    console.log(`getByName(${req.query.name})`);
    extraService.getByName(req.query.name)
        .then(extra => extra ? res.json(extra) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    extraService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    extraService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}