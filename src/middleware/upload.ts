const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require("aws-sdk");
import config from '../config';

const s3 = new aws.S3({
    accessKeyId: config.awsS3AccessKey,
    secretAccessKey: config.awsS3SecretKey
});

const storage = multerS3({ 
    s3: s3,
    bucket: config.awsS3Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname }) 
    },
    key: function (req, file, cb) { 
        cb(null, `reviews/${Date.now()}.jpeg`);
    },
})

exports.upload = multer({ storage: storage }); 