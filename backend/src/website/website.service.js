const db = require('../_helpers/db');
const Website = db.Website;

module.exports = {
    update,
    get,
    reset
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