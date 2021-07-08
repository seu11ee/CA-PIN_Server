import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import config from '../config';

const s3 = new aws.S3({
    accessKeyId: config.awsS3AccessKey,
    secretAccessKey: config.awsS3SecretKey
});


export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.awsS3Bucket,
        acl: 'public-read',
        key: function(req, file, cb){
            cb(null, 'images'+Date.now()+'.'+file.originalname.split('.').pop());
        }
    })
});