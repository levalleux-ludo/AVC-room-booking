const fileService = require('../files/files.service');
const bookingsConfigService = require('../bookings-config/bookings-config.service');
const bookingService = require('../bookings/booking.service');

module.exports = {
    removeUnusedFiles
}

async function removeUnusedFiles() {
    console.log('Scheduled task cleaner.removeUnusedFiles');
    await fileService.getAllFiles(
        filePrefix,
        async(list) => {
            let usedFiles = {};

            // TODO check for unused files in model (Booking-settings and more ?)

            // Check used pictures in ROOMS collection
            let bookingsConfig = await bookingsConfigService.get()
            if (bookingsConfig && bookingsConfig.termsAndConditions && bookingsConfig.termsAndConditions.fileId) {
                const fileId = bookingsConfig.termsAndConditions.fileId;
                usedFiles.hasOwnProperty(fileId) ? false : (usedFiles[fileId] = true)
            }

            let bookings = await bookingService.getAll();
            bookings.forEach(booking => {
                const fileId = booking.bookingFormId;
                if (fileId && (fileId !== '')) {
                    usedFiles.hasOwnProperty(fileId) ? false : (usedFiles[fileId] = true)
                }
            });

            list.forEach(async(fileId) => {
                // console.log('check image', imageId)
                if (!usedFiles.hasOwnProperty(fileId)) {
                    console.log("this file is not used in database:", fileId)
                    await deleteFile(fileId, () => {}, (err) => console.error(err));
                }
            });
        }, (err) => {
            console.error(err);
        });
}