const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('../../config.json');

const s3_config = {
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
    accessKeyId: process.env.aws_s3_avc_access_key_id,
    secretAccessKey: process.env.aws_s3_avc_secret_access_key,
    region: config.awsS3Region
};
var s3 = new AWS.S3(s3_config);
var bucketName = process.env.awsS3BucketName || config.awsS3BucketName;

function getEnv() {
    return s3_config;
}

function getTomorrow() {
    let today = Date.now();
    return new Date(today + 1);
}

function storeFile(fileId, file, then, catch_err) {
    console.log('[aws_s3 file manager] storeFile({}) ', file);

    const fileContent = fs.readFileSync(file);

    // let upload = new AWS.S3.ManagedUpload({
    const params = {
        Bucket: bucketName,
        Key: fileId,
        Body: fileContent,
        ACL: "public-read"
    };
    s3.upload(params, function(err, data) {
        if (err) {
            console.error(err, err.stack);
            catch_err(err);
            return;
        }
        console.log("Successfully uploaded data to " + bucketName + "/" + fileId);
        var params = { Bucket: bucketName, Key: fileId, Expires: 3600 * 24 }; /// expires after 1 day
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

function getFile(fileId) {
    console.log('[aws_s3 file manager] getFile({}) ', fileId);
    var params = { Bucket: bucketName, Key: fileId, Expires: 3600 * 24 }; /// expires after 1 day
    var url = s3.getSignedUrl('getObject', params);
    console.log(url);
    return { url: url };
}

function deleteFile(fileId, then, catch_err) {
    console.log('[aws_s3 file manager] deleteFile({}) ', fileId);
    s3.deleteObject({ Bucket: bucketName, Key: fileId }, function(err, data) {
        if (err) {
            catch_err("There was an error deleting your file: ", err.message);
        }
        then();
    });

}

function getFiles(prefix, then, catch_err) {
    console.log('[aws_s3 file manager] getFiles()');
    s3.listObjects({ Bucket: bucketName, Prefix: prefix }, function(err, data) {
        if (err) {
            catch_err("There was an error when listing objects: ", err.message);
            return;
        }
        then(data);
    });
}

module.exports = {
    storeFile,
    getFile,
    deleteFile,
    getEnv,
    getFiles
};