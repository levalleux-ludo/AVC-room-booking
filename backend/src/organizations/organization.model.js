const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: true, required: true },
    contactName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Organization', schema),
    collection: mongoose.connection.collections.organizations
};