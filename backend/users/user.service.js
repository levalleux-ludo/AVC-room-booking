const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
const Roles = db.Roles;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    createWithRole,
    update,
    delete: _delete,
    setRole,
    setMemberOf
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
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

async function create(userParam) {
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