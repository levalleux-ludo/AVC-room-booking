const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    serviceDescription: { type: String, required: false, default: '[service description]' }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Website', schema),
};