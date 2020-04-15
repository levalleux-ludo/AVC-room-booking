const db = require('../_helpers/db');
const BookingsConfig = db.BookingsConfig;

module.exports = {
    update,
    get,
    reset
};

async function get() {
    return await BookingsConfig.findOne();
}

async function update(bookingsConfigParam) {
    const bookingsConfig = await BookingsConfig.findOne();

    // copy bookingsConfigParam properties to bookingsConfig
    Object.assign(bookingsConfig, bookingsConfigParam);

    await bookingsConfig.save();
}

async function reset() {
    const bookingsConfig = await BookingsConfig.findOne();
    if (bookingsConfig) {
        await bookingsConfig.remove();
    }
    const bookingsConfigDefault = new BookingsConfig({}); // default value are defined in Model definition
    await bookingsConfigDefault.save();
    console.log("reset --> create a new bookingConfigs in DB")
        // await update({});
}

db.eventEmitter.on('connected', () => {
    console.log('bookingsConfig check if one document already exists');
    // If there is no document in the collection, then create it 
    BookingsConfig.countDocuments({}).then((count) => {
        if (count === 0) {
            console.log('bookingsConfig create document');
            const bookingsConfigDefault = new BookingsConfig({}); // default value are defined in Model definition
            bookingsConfigDefault.save();
        } else {
            console.log('bookingsConfig document exists. No creation');
        }
    });
});