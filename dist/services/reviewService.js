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
const Review_1 = __importDefault(require("../models/Review"));
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const http_errors_1 = __importDefault(require("http-errors"));
const getCafeReviewList = (cafeId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find().where("cafe").equals(cafeId).populate("user", ["_id", "nickname", "profileImg", "cafeti"]);
    let reviewDTOList = [];
    for (let review of reviews) {
        if (!review.user.profileImg) {
            review.user.profileImg = review.user.cafeti.img;
        }
        let reviewDTO = {
            _id: review._id,
            cafe: review.cafe,
            user: review.user,
            rating: review.rating,
            created_at: review.created_at,
            content: review.content
        };
        if (review.imgs) {
            reviewDTO.imgs = review.imgs;
        }
        if (review.recommend) {
            reviewDTO.recommend = review.recommend;
        }
        reviewDTOList.push(reviewDTO);
    }
    return reviewDTOList;
});
const checkIfReviewed = (cafeId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.default.findOne({ cafe: cafeId, user: userId });
    if (!review)
        return false;
    return true;
});
const createReview = (cafeId, userId, content, rating, recommend, imgs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = new Review_1.default({
            user: userId,
            cafe: cafeId,
            content: content,
            recommend: recommend,
            rating: rating,
            imgs: imgs,
            created_at: Date.now()
        });
        console.log(Date());
        console.log(review);
        yield review.save();
        return review;
    }
    catch (error) {
        console.log(error.message);
        throw http_errors_1.default(responseMessage.INTERNAL_SERVER_ERROR);
    }
});
module.exports = {
    getCafeReviewList,
    checkIfReviewed,
    createReview
};
//# sourceMappingURL=reviewService.js.map