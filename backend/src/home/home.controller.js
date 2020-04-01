const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const aws_s3 = require('../images/aws_s3');

router.get('/', getHome);

module.exports = router;

function getHome(req, res, next) {
    res.json(getStatus());
}

function getStatus() {
    return {
        app: {
            message: "hello world !",
            env: {
                node_env: process.env.NODE_ENV
            }
        },
        db: db.getStatus(),
        aws_s3: aws_s3.getEnv()
    }
}