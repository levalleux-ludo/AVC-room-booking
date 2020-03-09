const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Roles = Object.freeze({
    SysAdmin: 'SysAdmin',
    AvcAdmin: 'AvcAdmin',
    AvcStaff: 'AvcStaff',
    Customer: 'Customer',
    Guest: 'Guest'
});
const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    role: { type: String, enum: Object.values(Roles), default: Roles.Guest }
});

Object.assign(schema.statics, { Roles, });

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('User', schema),
    collection: mongoose.connection.collections.users,
    roles: Roles
};