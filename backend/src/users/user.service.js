const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
const Roles = db.Roles;
const Organization = db.Organization;

module.exports = {
    authenticate,
    count,
    getAll,
    getById,
    create,
    createWithRole,
    update,
    delete: _delete,
    setRole,
    setMemberOf,
    cleanUndefinedRefs,
    onDeleteOrganization
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, role: user.role, memberOf: user.memberOf }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function setRole({ userId }, role, requesterRole) {
    const user = await User.findById(userId);
    if (!user) {
        console.error('could not find user with id', userId)
        throw 'could not find user with id' + userId;
    }
    console.log('check user can not downgrade a user that have higher grade user.role', user.role, 'requesterRole', requesterRole)
    let currentRole = user.role;
    if (Roles.compare(currentRole, requesterRole) > 0) {
        console.error('could not downgrade a user with role', currentRole);
        throw 'could not downgrade a user with role' + currentRole;
    }

    console.log("Changing role of user", user.username, ' into ', role);
    user.role = role;

    // save user
    return await user.save();
}

async function setMemberOf(userId, memberOf) {
    const user = await User.findById(userId);
    if (!user) {
        console.error('could not find user with id', userId)
        throw 'could not find user with id' + userId;
    }
    console.log("Changing memberOf of user", user.username, ' into ', memberOf);
    user.memberOf = memberOf;

    // save user
    return await user.save();

}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function count() {
    let count = -1;
    await User.countDocuments({} /* no filter */ , function(err, nbUsers) {
        if (err) {
            console.error(err);
        } else {
            count = nbUsers;
        }
    });
    return count;
}

async function create(userParam) {

    // Only if the first user in the DB is 'admin', then give him the role SysAdmin
    if (userParam.username === 'admin') {
        // User.countDocuments({} /* no filter */ , function(err, count) {
        //     if (count == 0) {
        //         return createWithRole(userParam, Roles.SysAdmin);
        //     }
        // })
        if (await count() == 0) {
            return createWithRole(userParam, Roles.SysAdmin);
        }
    }
    // never accept the role from this entry point: always set Guest
    // There is another entry point only callable by admin, to change the role of an existing user
    await createWithRole(userParam, Roles.Guest)
}

async function createWithRole(userParam, role) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    userParam.role = role;
    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function cleanUndefinedRefs() {
    console.log('Scheduled task userService.cleanUndefinedRefs');
    await User.find(async(err, users) => {
        if (err) {
            console.error(err);
            return;
        }
        let orgas = await Organization.find().select("_id");
        // console.log("get all orgas:", orgas);
        let orgaIds = orgas.map(entry => entry._id.toString());
        // console.log("get all orgas:", orgaIds);
        users.forEach((user) => {
            // console.log("Look at user", user);
            let changed = false;
            const memberOf = Array.from(user.memberOf);
            memberOf.forEach((orgaId) => {
                if (orgaIds.indexOf(orgaId.toString()) == -1) {
                    console.log("Found undef ref to orga", orgaId, "in user", user.username);
                    user.memberOf.remove(orgaId);
                    changed = true;
                }
            })
            if (changed) {
                user.save();
            }
        });
        return;
    });
}

async function onDeleteOrganization(removedOrgaId) {
    console.log('update users after organization deleted', removedOrgaId)
    await User.find(async(err, users) => {
        if (err) {
            console.error(err);
            return;
        }
        users.forEach((room) => {
            let changed = false;
            if (user.memberOf.includes(removedExtraId)) {
                user.memberOf.remove(removedExtraId);
                changed = true;
            }
            if (changed) {
                console.log("user updated", user.username)
                user.save();
            }
        })
        return;
    });
}