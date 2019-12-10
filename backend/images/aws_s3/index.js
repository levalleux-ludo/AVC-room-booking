const AWS = require('aws-sdk');
const fs = require('fs');

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_S3_AVC_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_AVC_SECRET_ACCESS_KEY
});
var bucketName = 'avc-room-booking-pictures';

function storeImage(imageId, file, then, catch_err) {
    console.log('[aws_s3 image manager] storeImage({}) ', file);

    const fileContent = fs.readFileSync(file);

    let upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucketName,
            Key: imageId,
            Body: fileContent,
            ACL: "public-read"
        }
    });
    let uploadPromise = upload.promise();
    uploadPromise.then(
        function(data) {
            console.log("Successfully uploaded data to " + bucketName + "/" + imageId);
            var params = { Bucket: bucketName, Key: imageId };
            var promise = s3.getSignedUrlPromise('getObject', params);
            promise.then(
                function(url) {
                    console.log('The URL is', url);
                    then(url);
                },
                function(err) {
                    console.error(err, err.stack)
                    catch_err(err);
                });
        }).catch(
        function(err) {
            console.error(err, err.stack);
            catch_err(err);
        });

}

function getImage(imageId) {
    console.log('[aws_s3 image manager] getImage({}) ', imageId);
    var params = { Bucket: bucketName, Key: imageId };
    return { url: s3.getSignedUrl('getObject', params) };
}

function deleteImage(imageId, then, catch_err) {
    console.log('[aws_s3 image manager] deleteImage({}) ', imageId);
    s3.deleteObject({ Bucket: bucketName, Key: imageId }, function(err, data) {
        if (err) {
            catch_err("There was an error deleting your file: ", err.message);
        }
        then();
    });

}

module.exports = {
    storeImage,
    getImage,
    deleteImage
};