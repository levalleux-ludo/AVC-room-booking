const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: true, required: true },
    defaultRate: { type: Number, required: true },
    perPerson: { type: Boolean, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Extra', schema),
    collection: mongoose.connection.collections.extras
};