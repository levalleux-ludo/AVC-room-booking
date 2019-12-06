const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');

router.get('/', getHome);

module.exports = router;

function getHome(req, res, next) {
    res.json(getStatus());
}

function getStatus() {
    return {
        app: {
            message: "hello world !",
            env: process.env.NODE_ENV
        },
        db: db.getStatus()
    }
}