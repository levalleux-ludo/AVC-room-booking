const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/user.service');

module.exports = jwt;
module.exports.deactivateForTest = deactivateForTest;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/room',
            '/room/:id',
            '/'
        ]
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