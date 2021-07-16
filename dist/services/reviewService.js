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
const mongoose_1 = __importDefault(require("mongoose"));
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const http_errors_1 = __importDefault(require("http-errors"));
const koreanDate = require("../modules/dateCalculate");
const Cafe_1 = __importDefault(require("../models/Cafe"));
const getCafeReviewList = (cafeId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find().where("cafe").equals(cafeId).populate("user", ["_id", "nickname", "profileImg", "cafeti"]).sort({ created_at: -1 });
    let reviewDTOList = [];
    for (let review of reviews) {
        if (!review.user.profileImg) {
            review.user.profileImg = review.user.cafeti.plainImg;
        }
        let writerDTO = {
            _id: review.user._id,
            nickname: review.user.nickname,
            profileImg: review.user.profileImg
        };
        let reviewDTO = {
            _id: review._id,
            cafeId: review.cafe._id,
            writer: writerDTO,
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
            created_at: koreanDate.getDate()
        });
        yield review.save();
        return review;
    }
    catch (error) {
        console.log(error.message);
        throw http_errors_1.default(responseMessage.INTERNAL_SERVER_ERROR);
    }
});
const modifyReview = (reviewId, userId, content, rating, isAllDeleted, recommend, imgs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield Review_1.default.findById(reviewId);
        if (!review)
            return null;
        // if (review.user != userId){
        //     throw createError(statusCode.UNAUTHORIZED,responseMessage.UNAUTHORIZED);
        // }
        review.content = content;
        review.rating = rating;
        review.recommend = recommend;
        review.updated_at = koreanDate.getDate();
        if (!isAllDeleted && imgs.length != 0) {
            review.imgs = imgs;
        }
        else if (isAllDeleted) {
            review.imgs = undefined;
        }
        yield review.save();
        return review;
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
});
const deleteReview = (reviewId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield Review_1.default.findById(reviewId);
        if (!review)
            return null;
        if (review.user != userId) {
            throw http_errors_1.default(statusCode.UNAUTHORIZED, responseMessage.UNAUTHORIZED);
        }
        const deletedReview = yield Review_1.default.remove({ _id: reviewId }, function (err) {
            if (err) {
                throw err;
            }
        });
        return deletedReview;
    }
    catch (error) {
        throw (error);
    }
});
const updateCafeAverageRating = (cafeId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.aggregate([
        {
            $match: {
                cafe: mongoose_1.default.Types.ObjectId(cafeId)
            }
        },
        {
            $group: {
                _id: "$cafe",
                average: { $avg: "$rating" }
            }
        }
    ]);
    var cafeRating = undefined;
    if (reviews.length != 0) {
        cafeRating = reviews[0].average;
    }
    cafeRating = Number(cafeRating.toFixed(1));
    yield Cafe_1.default.findByIdAndUpdate(cafeId, {
        rating: cafeRating
    }, {
        new: true,
        useFindAndModify: false
    });
});
const getMyReviews = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const myReviews = yield Review_1.default.find({ user: userId }).populate("cafe").sort({ created_at: -1 });
    var myReviewsDTO = [];
    for (let review of myReviews) {
        let myReview = {
            _id: review._id,
            cafeName: review.cafe.name,
            cafeId: review.cafe._id,
            content: review.content,
            rating: review.rating,
            create_at: review.created_at,
            imgs: review.imgs,
            recommend: review.recommend
        };
        myReviewsDTO.push(myReview);
    }
    return myReviewsDTO;
});
module.exports = {
    getCafeReviewList,
    checkIfReviewed,
    createReview,
    modifyReview,
    deleteReview,
    updateCafeAverageRating,
    getMyReviews
};
//# sourceMappingURL=reviewService.js.map