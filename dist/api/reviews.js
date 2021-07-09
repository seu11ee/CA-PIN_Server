"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const reviewService = require("../services/reviewService");
const imgService = require("../services/imgService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const auth_1 = __importDefault(require("../middleware/auth"));
const http_errors_1 = __importDefault(require("http-errors"));
const upload_1 = __importDefault(require("../middleware/upload"));
/**
 *  @route GET reviews/:cafeId
 *  @desc get a cafe review list
 *  @access Public
 */
router.get("/", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cafeId = req.query.cafe;
    const userId = res.locals.userId;
    if (!cafeId || !mongoose_1.default.isValidObjectId(cafeId)) {
        next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER));
    }
    try {
        const reviews = yield reviewService.getCafeReviewList(cafeId);
        if (reviews.length == 0) {
            res.status(statusCode.NO_CONTENT).json();
            next();
        }
        const isReviewed = yield reviewService.checkIfReviewed(cafeId, userId);
        return res.status(statusCode.OK).json({
            message: responseMessage.READ_CAFE_REVIEW_SUCCESS,
            reviews: reviews,
            isReviewed: isReviewed
        });
    }
    catch (error) {
        next(error);
    }
}));
router.post("/", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cafeId = req.query.cafe;
    const userId = res.locals.userId;
    console.log(userId);
    const { content, recommend, rating, img0, img1, img2, img3, img4 } = req.body;
    if (recommend && !recommend.isArray(Number))
        next(http_errors_1.default(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE)));
    if (!content || !rating)
        next(http_errors_1.default(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)));
    if (!cafeId || !mongoose_1.default.isValidObjectId(cafeId)) {
        next(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER));
    }
    try {
        var imgs = [img0, img1, img2, img3, img4];
        var urls = [];
        console.log(imgs);
        for (let i = 0; i < imgs.length; i++) {
            if (imgs[i]) {
                const url = imgs[i];
            }
        }
        const isReviewed = yield reviewService.checkIfReviewed(cafeId, userId);
        console.log(isReviewed);
        if (isReviewed)
            next(http_errors_1.default(http_errors_1.default(statusCode.BAD_REQUEST, responseMessage.REPEATED_VALUE)));
        const review = yield reviewService.createReview(cafeId, userId, content, rating, recommend, imgs);
        console.log(review);
        res.status(statusCode.CREATED).json();
    }
    catch (error) {
        next(error);
    }
}), router.post("/image", auth_1.default, upload_1.default.array("img", 5), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield imgService.uploadS3(res.locals.userId, req.file.buffer);
    console.log(image);
    res.json({ image });
})));
module.exports = router;
//# sourceMappingURL=reviews.js.map