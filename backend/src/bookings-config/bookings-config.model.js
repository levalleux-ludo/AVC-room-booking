const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    startTime: { type: Number, required: false, default: 7.5 },
    endTime: { type: Number, required: false, default: 17.5 },
    termsAndConditionsHTML: { type: String, required: false, default: "<h1>Terms &amp; Conditions</h1>" }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('BookingsConfig', schema),
    collection: mongoose.connection.collections.bookingsConfigs
};