const db = require('../_helpers/db');
const Organization = db.Organization;

module.exports = {
    create,
    update,
    delete: _delete,
    getAll,
    getById,
    getByName
};

async function getAll() {
    return await Organization.find();
}

async function getById(id) {
    return await Organization.findById(id);
}

async function getByName(name) {
    return await Organization.findOne({ name: name });
}

async function create(organizationParam) {
    // validate
    if (await Organization.findOne({ organization: organizationParam.name })) {
        console.log('found the organization', organizationParam.name);
        throw 'An organization with the name "' + organizationParam.name + '" already exists';
    }

    const organization = new Organization(organizationParam);

    // save organization
    await organization.save();
    return organization;
}

async function update(id, organizationParam) {
    const organization = await Organization.findById(id);

    // validate
    if (!organization) throw 'Organization not found';

    // copy userParam properties to user
    Object.assign(organization, organizationParam);

    await organization.save();
}

async function _delete(id) {
    await Organization.findByIdAndRemove(id);
}