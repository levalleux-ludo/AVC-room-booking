﻿const express = require('express');
const router = express.Router();
const roomService = require('./room.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;

// routes
router.post('/create', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), create);
router.put('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), update);
router.delete('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), _delete);
// router.param('name', function (req, res, next, name) {
//     console.log(`capture param ${name}`);
//     req.name = name;
//     next();
// });
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
    console.log(`getById(${req.params.id})`);
    roomService.getById(req.params.id)
        .then(room => room ? res.json(room) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByName(req, res, next) {
    console.log(`getByName(${req.query.name})`);
    roomService.getByName(req.query.name)
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