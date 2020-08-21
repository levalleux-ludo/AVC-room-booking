const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('../_helpers/authorize');
const Roles = require('./user.model').roles;

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/count', count);
router.post('/customer', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), setCustomer);
router.post('/staff', authorize([Roles.SysAdmin, Roles.AvcAdmin]), setAvcStaff);
router.post('/admin', authorize([Roles.SysAdmin, Roles.AvcAdmin]), setAvcAdmin);
router.post('/sysAdmin', authorize([Roles.SysAdmin]), setSysAdmin);
router.get('/', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), getAll);
router.get('/current', getCurrent);
router.get('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), getById);
// router.put('/:id', update);
router.put('/:id/memberOf', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), setMemberOf);
// router.delete('/:id', _delete);
router.put('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), update);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ?
            res.json(user) :
            res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function setCustomer(req, res, next) {
    setRole(Roles.Customer, req, res, next);
}

function setAvcStaff(req, res, next) {
    setRole(Roles.AvcStaff, req, res, next);
}

function setSysAdmin(req, res, next) {
    setRole(Roles.SysAdmin, req, res, next);
}

function setAvcAdmin(req, res, next) {
    setRole(Roles.AvcAdmin, req, res, next);
}

function setRole(role, req, res, next) {
    console.log('check user is not himself', req.user.sub, req.body.userId)
    if (req.user.sub == req.body.userId) {
        res.status(404).json({ message: 'Changing its own role is not allowed' });
        return;
    }
    userService.setRole(req.body, role, req.user.role)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Changing role of user failed' }))
        .catch(err => next(err));
}

function setMemberOf(req, res, next) {
    userService.setMemberOf(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getCurrent(req.user.sub)
        .then(user => user ?
            res.json(user) :
            res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function count(req, res, next) {
    userService.count()
        .then((count) => res.json({ count }))
        .catch(err => next(err));
}