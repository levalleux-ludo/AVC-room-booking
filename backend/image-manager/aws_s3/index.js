module.exports = {
    storeImage,
    getImage,
    deleteImage
}

function storeImage(filename, data) {
    console.log('[aws_s3 image manager] storeImage({}) ', filename);
    return 'an aws id'; // imageID
}

function getImage(imageID) {
    console.log('[aws_s3 image manager] getImage({}) ', imageID);
    return 'an aws url'; // imageUrl
}

function deleteImage(imageID) {
    console.log('[aws_s3 image manager] deleteImage({}) ', imageID);
}