const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    startTime: { type: Number, required: false, default: 7.5 },
    endTime: { type: Number, required: false, default: 17.5 }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('BookingsConfig', schema),
    collection: mongoose.connection.collections.bookingsConfigs
};