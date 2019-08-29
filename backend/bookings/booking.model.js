const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExtraSchema = new Schema({
    extra: String,
    rate: Number,
    quantity: Number,
    comments: String
});
const BookingSchema = new Schema({
    ref: { type: String, unique: true, required: true },
    title: {type: String, required: false},
    date: {type: Date, required: true},
    startTime: {type: Date, required: true},
    duration: {type: Number, required: true},
    roomId: {type: Schema.Types.ObjectId, required: true},
    extras: {type: [ExtraSchema], required: false}
});

BookingSchema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('Booking', BookingSchema),
    collection: mongoose.connection.collections.bookings
};
