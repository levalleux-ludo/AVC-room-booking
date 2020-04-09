const jwt = require('../_helpers/jwt');
const Roles = require('../users/user.model').roles;

module.exports = get_organizations_for_user;

function get_organizations_for_user() {
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt(),

        // return organizations the user is allowed to see in req.orgas
        (req, res, next) => {
            console.log('Check user organizations - role:', req.user.role, 'orgas:', req.user.memberOf);
            if ([Roles.SysAdmin, Roles.AvcAdmin, Roles.AvcStaff].includes(req.user.role)) {
                // The user is allowed to see all orgas
                req.orgas = '*';
            } else {
                req.orgas = req.user.memberOf;
            }

            // authentication and authorization successful
            next();
        }
    ];
}