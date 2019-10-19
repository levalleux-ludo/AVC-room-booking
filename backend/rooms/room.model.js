const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: true, required: true },
    capacity: { type: Number, required: true },
    rentRateHour: { type: Number, required: true },
    rentRateDay: { type: Number, required: false },
    availableExtras: { type: [Schema.Types.ObjectId], default: [] }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Room', schema),
    collection: mongoose.connection.collections.rooms
};