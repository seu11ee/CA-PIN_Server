"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../config"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: config_1.default.awsS3AccessKey,
    secretAccessKey: config_1.default.awsS3SecretKey
});
// const uploadImg = (userId, file) => {
//     const image = multer({
//         storage: multerS3({
//             s3: s3,
//             bucket: config.awsS3Bucket,
//             acl: 'public-read',
//             key: function(req, file, cb){
//                 cb(null, `reviews/${userId}/${Date.now()}.jpeg`);
//             }
//         })
//     });
//     return image;
// }
const uploadS3 = (userId, file) => {
    const param = {
        Bucket: config_1.default.awsS3Bucket,
        Key: `${userId}/${Date.now()}.jpeg`,
        ACL: 'public-read',
        Body: file,
        ContentType: 'image/jpeg'
    };
    return new Promise((res, rej) => {
        s3.upload(param, function (err, data) {
            if (err) {
                rej(Error("SERVER_ERROR"));
            }
            else {
                res(data.Location);
            }
        });
    });
};
module.exports = {
    uploadS3
};
//# sourceMappingURL=imgService.js.map