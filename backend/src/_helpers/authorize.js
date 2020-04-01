const expressJwt = require('express-jwt');
const { secret } = require('../config.json');
const jwt = require('./jwt');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt(),

        // authorize based on user role
        (req, res, next) => {
            console.log('Check authorized user:', req.user, "roles", roles)
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }


            // authentication and authorization successful
            next();
        }
    ];
}