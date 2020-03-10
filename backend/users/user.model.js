const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Roles = Object.freeze({
    SysAdmin: 'SysAdmin',
    AvcAdmin: 'AvcAdmin',
    AvcStaff: 'AvcStaff',
    Customer: 'Customer',
    Guest: 'Guest',
    compare: (role1, role2) => {
        console.log('compare ', role1, 'with ', role2);
        switch (role1) {
            case Roles.SysAdmin:
                {
                    return (role2 === Roles.SysAdmin) ? 0 : 1;
                }
            case Roles.AvcAdmin:
                {
                    return (role2 === Roles.SysAdmin) ? -1 : (role2 === Roles.AvcAdmin) ? 0 : 1;
                }
            case Roles.AvcStaff:
                {
                    return ((role2 === Roles.SysAdmin) || (role2 === Roles.AvcAdmin)) ? -1 : (role2 === Roles.AvcStaff) ? 0 : 1;
                }
            case Roles.Customer:
                {
                    return (role2 === Roles.Guest) ? 1 : (role2 === Roles.Customer) ? 0 : -1;
                }
            case Roles.Guest:
                {
                    return (role2 === Roles.Guest) ? 0 : -1;
                }
            default:
                {
                    console.error('Not expected default case');
                }
        }
    }
});
const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    role: { type: String, enum: Object.values(Roles), default: Roles.Guest },
    memberOf: { type: [Schema.Types.ObjectId], default: [] }
});

Object.assign(schema.statics, { Roles, });

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('User', schema),
    collection: mongoose.connection.collections.users,
    roles: Roles
};