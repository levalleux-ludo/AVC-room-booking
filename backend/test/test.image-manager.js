const assert = require('assert');

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}

function common_tests(provider, get_image_manager, assert_imageId, assert_imageUrl) {

    let imageId;
    let imageUrl;

    it('storeImage [' + provider + ']', (done) => {
        imageId = get_image_manager().storeImage('image.txt', 'some data');
        assert_imageId(imageId);
        done();
    });

    it('getImage [' + provider + ']', (done) => {
        imageUrl = get_image_manager().getImage(imageId);
        assert_imageUrl(imageUrl);
        done();
    });

    it('deleteImage [' + provider + ']', (done) => {
        get_image_manager().deleteImage(imageId);
        done();
    });

}

describe('image manager local', () => {

    let image_manager;

    before(function() {
        image_manager = requireUncached('../image-manager');
    })

    common_tests(
        'local',
        () => image_manager,
        (imageId) => assert(imageId == 'a local id', 'the imageId is a local id'),
        (imageUrl) => assert(imageUrl == 'a local url', 'the imageUrl is a local url')
    );

});

describe('image manager aws_s3', () => {

    let env_save;
    let image_manager;

    before(function() {
        env_save = process.env;
        process.env.USE_AWS_S3 = "true";
        image_manager = requireUncached('../image-manager');
    })

    common_tests(
        'aws_s3',
        () => image_manager,
        (imageId) => assert(imageId === 'an aws id', 'the imageId is an aws id'),
        (imageUrl) => assert(imageUrl === 'an aws url', 'the imageUrl is an aws url')
    );

    after(function() {
        process.env = env_save;
    })

});