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
const Cafeti_1 = __importDefault(require("../models/Cafeti"));
const responseMessage = require("../modules/responseMessage");
const getCafeReviewList = (cafeId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cafeId || !mongoose_1.default.isValidObjectId(cafeId)) {
        throw Error(responseMessage.INVALID_IDENTIFIER);
    }
    const reviews = yield Review_1.default.find().where("cafe").equals(cafeId).populate("user", "_id nickname profileImg cafeti");
    let reviewDTOList = [];
    for (let review of reviews) {
        if (!review.user.profileImg) {
            console.log("here");
            const cafeti_img = yield Cafeti_1.default.findOne().where('type').equals(review.user.cafeti).select("img");
            review.user.profileImg = cafeti_img.img;
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
    if (reviewDTOList.length == 0) {
        throw Error(responseMessage.NO_CONTENT);
    }
    return reviewDTOList;
});
module.exports = {
    getCafeReviewList
};
//# sourceMappingURL=reviewService.js.map