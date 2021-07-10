"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require("aws-sdk");
const config_1 = __importDefault(require("../config"));
const s3 = new aws.S3({
    accessKeyId: config_1.default.awsS3AccessKey,
    secretAccessKey: config_1.default.awsS3SecretKey
});
const storage = multerS3({
    s3: s3,
    bucket: config_1.default.awsS3Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, `reviews/${Date.now()}.jpeg`);
    },
});
exports.upload = multer({ storage: storage });
//# sourceMappingURL=upload.js.map