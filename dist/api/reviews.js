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
const router = express_1.default.Router();
const reviewService = require("../services/reviewService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const auth = require("../middleware/auth");
/**
 *  @route GET reviews/:cafeId
 *  @desc get a cafe review list
 *  @access Public
 */
router.get("/", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cafeId = req.query.cafe;
    const userId = res.locals.userId;
    try {
        const reviews = yield reviewService.getCafeReviewList(cafeId);
        const isReviewed = yield reviewService.checkIfReview(cafeId, userId);
        console.log(isReviewed);
        return res.status(statusCode.OK).json({
            message: responseMessage.READ_CAFE_REVIEW_SUCCESS,
            reviews: reviews
        });
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.INVALID_IDENTIFIER:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
            case responseMessage.NO_CONTENT:
                res.status(statusCode.NO_CONTENT).send();
            default:
                console.log(error.message);
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: responseMessage.INTERNAL_SERVER_ERROR });
        }
    }
}));
router.post("/:reviewId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = req.params.reviewId;
}));
module.exports = router;
//# sourceMappingURL=reviews.js.map