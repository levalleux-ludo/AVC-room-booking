const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: true, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Organization', schema),
    collection: mongoose.connection.collections.organizations
};