const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require("aws-sdk");
import config from '../config';
import createError from "http-errors";

const s3 = new aws.S3({
    accessKeyId: config.awsS3AccessKey,
    secretAccessKey: config.awsS3SecretKey
});
const fileFilter = (req, file, callback) =>{
    console.log(file);
    const typeArray = file.mimetype.split('/');

    const fileType = typeArray[1]; // 이미지 확장자 추출
    console.log("11",fileType);
    //이미지 확장자 구분 검사
    if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png'){
        callback(null, true)
    }else {
        return callback(createError(400,"*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다."), false)
    }
}

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

exports.upload = multer({
     storage: storage,
     fileFilter: fileFilter 
    }); 