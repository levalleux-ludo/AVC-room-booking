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
    title: { type: String, required: false },
    organizationId: { type: Schema.Types.ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    roomId: { type: Schema.Types.ObjectId, required: true },
    extras: { type: [Schema.Types.ObjectId], required: false },
    totalPrice: { type: Number, required: false, default: 0 }
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