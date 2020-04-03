const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    serviceDescription: { type: String, required: false, default: '[service description]' },
    presentationHTML: { type: String, required: false, default: '<div>[service presentation]</div>' },
    indicatorsHTML: { type: String, required: false, default: '<div>[booking indicators]</div>' }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Website', schema),
};