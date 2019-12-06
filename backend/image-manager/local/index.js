module.exports = {
    storeImage,
    getImage,
    deleteImage
}

function storeImage(filename, data) {
    console.log('[local image manager] storeImage({}) ', filename);
    return 'a local id'; // imageID
}

function getImage(imageID) {
    console.log('[local image manager] getImage({}) ', imageID);
    return 'a local url'; // imageUrl
}

function deleteImage(imageID) {
    console.log('[local image manager] deleteImage({}) ', imageID);
}