const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const date_helper = require('../_helpers/date_helper');

const BookingStates = Object.freeze({
    Scheduled: 'Scheduled',
    InProgress: 'InProgress',
    Completed: 'Completed',
    Cancelled: 'Cancelled'
});

const ExtraSchema = new Schema({
    extra: String,
    rate: Number,
    quantity: Number,
    comments: String
});
var BookingSchema = new Schema({
    ref: { type: String, unique: true, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    roomId: { type: Schema.Types.ObjectId, required: true },
    cancelled: { type: Boolean, default: false },
    privateData: { type: Schema.Types.ObjectId }
});

BookingSchema.set('toJSON', { virtuals: true });
// Virtuals don't allow to use them in queries
// BookingSchema.virtual('endTime').get(function() {
//     return date_helper.computeEndingTime(this.startTime, this.duration);
// });

var BookingPrivateSchema = new Schema({
    title: { type: String, required: false },
    details: { type: String, required: false },
    organizationId: { type: Schema.Types.ObjectId, required: true },
    extras: { type: [Schema.Types.ObjectId], required: false },
    totalPrice: { type: Number, required: false, default: 0 },
    hirersDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true }
    },
    responsibleDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true }
    }
});

BookingPrivateSchema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Booking', BookingSchema),
    privateModel: mongoose.model('BookingPrivateData', BookingPrivateSchema),
    collection: mongoose.connection.collections.bookings,
    states: BookingStates
};