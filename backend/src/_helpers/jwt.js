const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/user.service');

module.exports = jwt;
module.exports.deactivateForTest = deactivateForTest;


function jwt() {
    const secret = process.env.secret_key || config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/users/count',
            '/room',
            '/room/:id',
            '/home',
            '/',
            '/api/home',
            '/api',
            '/website/background',
            /\/images\/.*$/g, // use a regex to define all image id in '/images/:id'
            { url: '/website', methods: ['GET'] } // keep jwt required for PUT website requests
        ],
        useOriginalUrl: false
    });
}
var isDeactivated = false;

function deactivateForTest(deactivate) {
    isDeactivated = deactivate;
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user && !isDeactivated) {
        return done(null, true);
    }

    done();
};