const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const termsAndConditions = new Schema({
    fileId: { type: String, required: false, default: '' },
    fileName: { type: String, required: false, default: '' },
    uploadDate: { type: Date, required: false, default: undefined }
})
const schema = new Schema({
    startTime: { type: Number, required: false, default: 7.5 },
    endTime: { type: Number, required: false, default: 17.5 },
    // termsAndConditions: { type: termsAndConditions, required: false, default: { fileId: '', fileName: '', uploadDate: undefined } }
    termsAndConditions: {
        fileId: { type: String, required: false, default: '' },
        fileName: { type: String, required: false, default: '' },
        uploadDate: { type: Date, required: false, default: undefined }
    }
});

schema.set('toJSON', { virtuals: true });

module.exports = {
    model: mongoose.model('BookingsConfig', schema),
    collection: mongoose.connection.collections.bookingsConfigs
};