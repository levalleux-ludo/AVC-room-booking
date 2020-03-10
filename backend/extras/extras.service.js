const db = require('../_helpers/db');
const Extra = db.Extra;

module.exports = {
    create,
    update,
    delete: _delete,
    getAll,
    getById,
    getByName
};

async function getAll() {
    return await Extra.find();
}

async function getById(id) {
    return await Extra.findById(id);
}

async function getByName(name) {
    return await Extra.findOne({ name: name });
}

async function create(extraParam) {
    // validate
    if (await Extra.findOne({ name: extraParam.name })) {
        console.log('found the extra', extraParam.name);
        throw 'An extra with the name "' + extraParam.name + '" already exists';
    }

    const extra = new Extra(extraParam);

    // save extra
    await extra.save();
    return extra;
}

async function update(id, extraParam) {
    const extra = await Extra.findById(id);

    // validate
    if (!extra) throw 'Extra not found';

    // copy extraParam properties to extra
    Object.assign(extra, extraParam);

    await extra.save();
}

async function _delete(id) {
    // TODO: remove all references to this extra in other objects: Room
    
    await Extra.findByIdAndRemove(id);
}