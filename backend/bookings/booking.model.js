const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const date_helper = require('../_helpers/date_helper');

const ExtraSchema = new Schema({
    extra: String,
    rate: Number,
    quantity: Number,
    comments: String
});
var BookingSchema = new Schema({
    ref: { type: String, unique: true, required: true },
    title: {type: String, required: false},
    date: {type: Date, required: true},
    startTime: {type: Date, required: true},
    duration: {type: Number, required: true},
    // be aware : endTime is computed by default at creation. Need to be expliciteley recalculated when updating the document
    endTime: {type: Date, default: function() { return date_helper.computeEndingTime(this.startTime, this.duration); }},
    roomId: {type: Schema.Types.ObjectId, required: true},
    extras: {type: [ExtraSchema], required: false}
});

BookingSchema.set('toJSON', { virtuals: true });
// Virtuals don't allow to use them in queries
// BookingSchema.virtual('endTime').get(function() {
//     return date_helper.computeEndingTime(this.startTime, this.duration);
// });

module.exports = {
    model: mongoose.model('Booking', BookingSchema),
    collection: mongoose.connection.collections.bookings
};
