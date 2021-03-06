const express = require('express');
const router = express.Router();
const organizationService = require('./organization.service');
const authorize = require('../_helpers/authorize');
const Roles = require('../users/user.model').roles;
const get_organizations_for_user = require('../_helpers/get_organizations_for_user');

// routes
router.post('/create', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), create);
router.put('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), update);
router.delete('/:id', authorize([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff]), _delete);
router.get('/', get_organizations_for_user(), function(req, res, next) {
    if (req.query.name) return getByName(req, res, next);
    if (req.query.id) {
        req.params.id = req.query.id;
        return getById(req, res, next);
    }
    return getAll(req, res, next);
});
router.get('/:id', get_organizations_for_user(), getById);

module.exports = router;


function create(req, res, next) {
    organizationService.create(req.body)
        .then((orga) => res.json(orga))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    organizationService.getAll()
        .then(organizations => {
            if (req.orgas === '*') {
                res.json(organizations);
            } else {
                res.json(organizations.filter(orga => req.orgas.includes(orga.id)));
            }
        })
        .catch(err => next(err));
}

function getById(req, res, next) {
    console.log(`getById(${req.params.id})`);
    organizationService.getById(req.params.id)
        .then(organization => {
            if (organization) {
                if ((req.orgas === '*') || req.orgas.includes(organization.id)) {
                    res.json(organization);
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => next(err));
}

function getByName(req, res, next) {
    console.log(`getByName(${req.query.name})`);
    organizationService.getByName(req.query.name)
        .then(organization => {
            if (organization) {
                if ((req.orgas === '*') || req.orgas.includes(organization.id)) {
                    res.json(organization);
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => next(err));
}

function update(req, res, next) {
    organizationService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    organizationService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}