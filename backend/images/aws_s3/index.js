const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('../../config.json');

const s3_config = {
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_S3_AVC_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_AVC_SECRET_ACCESS_KEY,
    region: config.awsS3Region
};
var s3 = new AWS.S3(s3_config);
var bucketName = config.awsS3BucketName;

function getEnv() {
    return s3_config;
}

function getTomorrow() {
    let today = Date.now();
    return new Date(today + 1);
}

function storeImage(imageId, file, then, catch_err) {
    console.log('[aws_s3 image manager] storeImage({}) ', file);

    const fileContent = fs.readFileSync(file);

    // let upload = new AWS.S3.ManagedUpload({
    const params = {
        Bucket: bucketName,
        Key: imageId,
        Body: fileContent,
        ACL: "public-read"
    };
    s3.upload(params, function(err, data) {
        if (err) {
            console.error(err, err.stack);
            catch_err(err);
            return;
        }
        console.log("Successfully uploaded data to " + bucketName + "/" + imageId);
        var params = { Bucket: bucketName, Key: imageId, Expires: 3600 * 24 }; /// expires after 1 day
        var promise = s3.getSignedUrlPromise('getObject', params);
        promise.then(
            function(url) {
                console.log('The URL is', url);
                then(url);
            },
            function(err) {
                console.error(err, err.stack)
                catch_err(err);
            }
        );
    });
}

function getImage(imageId) {
    console.log('[aws_s3 image manager] getImage({}) ', imageId);
    var params = { Bucket: bucketName, Key: imageId, Expires: 3600 * 24 }; /// expires after 1 day
    var url = s3.getSignedUrl('getObject', params);
    console.log(url);
    return { url: url };
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

function getImages(then, catch_err) {
    console.log('[aws_s3 image manager] getImages()');
    s3.listObjects({ Bucket: bucketName }, function(err, data) {
        if (err) {
            catch_err("There was an error when listing objects: ", err.message);
            return;
        }
        then(data);
    });
}

module.exports = {
    storeImage,
    getImage,
    deleteImage,
    getEnv,
    getImages
};