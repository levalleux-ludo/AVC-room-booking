var local = require('./local');

var storeImage = local.storeImage;
var getImage = local.getImage;
var deleteImage = local.deleteImage;

console.log("USE_AWS_S3=", process.env.USE_AWS_S3);

if (process.env.USE_AWS_S3 === "true") {
    var aws_s3 = require('./aws_s3');
    storeImage = aws_s3.storeImage;
    getImage = aws_s3.getImage;
    deleteImage = aws_s3.deleteImage;

}

module.exports = {
    storeImage,
    getImage,
    deleteImage
}