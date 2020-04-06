const db = require('../_helpers/db');
const Website = db.Website;

module.exports = {
    update,
    get,
    reset,
    getBackgroundURL
};

async function get() {
    return await Website.findOne(); // warning: no control if there is only one document in model
}

async function update(websiteParam) {
    const website = await Website.findOne(); // warning: no control if there is only one document in model

    // copy websiteParam properties to website
    Object.assign(website, websiteParam);

    await website.save();
}

async function reset() {
    update({});
}

async function getBackgroundURL() {
    return 'https://avc-room-booking-pictures.s3.eu-west-2.amazonaws.com/eca6f88b-d57c-4142-95d3-2b1cc638eb05?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAXCUMUBK5C2OCFB4S%2F20200406%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200406T200152Z&X-Amz-Expires=86400&X-Amz-Signature=006f84e2e1911542037a17e4e71d4f13a22e2db4bc8b9520a471366f3adb9a9b&X-Amz-SignedHeaders=host';
}

db.eventEmitter.on('connected', () => {
    console.log('website check if one document already exists');
    // If there is no document in the collection, then create it 
    Website.countDocuments({}).then((count) => {
        if (count === 0) {
            console.log('website create document');
            const websiteDefault = new Website({}); // default value are defined in Model definition
            websiteDefault.save();
        } else {
            console.log('website document exists. No creation');
        }
    });
});