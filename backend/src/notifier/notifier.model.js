const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    host: { type: String, required: false, default: '' },
    port: { type: Number, required: false, default: 587 },
    secure: { type: Boolean, required: false, default: false },
    auth: {
        user: { type: String, required: false, default: '' },
        cypherPass: { type: String, required: false, default: '' }
    },
    receivers: { type: [String], required: false, default: [] }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Notifier', schema),
};