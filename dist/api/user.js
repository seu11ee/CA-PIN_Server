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
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const userService = require("../services/userService");
const categoryService = require("../services/categoryService");
const reviewService = require("../services/reviewService");
/**
 *  @route Post api/user/login
 *  @desc Authenticate user & get token(로그인)
 *  @access Public
 */
router.post("/login", [
    express_validator_1.check("email", "Please include a valid email").not().isEmpty(),
    express_validator_1.check("password", "password is required").not().isEmpty(),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    const { email, password } = req.body;
    try {
        const user = yield userService.loginUser(email, password);
        const userToken = yield userService.generateToken(user._id);
        return res.status(statusCode.OK).json({
            message: responseMessage.SIGN_IN_SUCCESS,
            loginData: {
                nickname: user.nickname,
                token: userToken
            },
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Post api/user/signup
 *  @desc generate user(회원가입)
 *  @access Public
 */
router.post("/signup", [
    express_validator_1.check("nickname", "nickname is required").not().isEmpty(),
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "password is required").not().isEmpty(),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    const { nickname, email, password } = req.body;
    try {
        yield userService.signupUser(nickname, email, password);
        return res.status(statusCode.CREATED).json({
            message: responseMessage.SIGN_UP_SUCCESS
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Get api/user/categoryList
 *  @desc fetch my category list(내 카테고리-마이페이지)
 *  @access Private
 */
router.get("/categoryList", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myCategoryList = yield categoryService.fetchMyCategory(res.locals.userId);
        return res.status(statusCode.OK).json({
            message: responseMessage.READ_MY_CATEGORY_SUCCESS,
            myCategoryList: myCategoryList
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Get /user/myInfo
 *  @desc fetch my category list(내 카테고리-마이페이지)
 *  @access Private
 */
router.get("/myInfo", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield userService.fetchUserInfo(res.locals.userId);
        return res.status(statusCode.OK).json({
            message: responseMessage.READ_USERINFO_SUCCESS,
            myInfo: {
                cafeti: userInfo.user.cafeti,
                nickname: userInfo.user.nickname,
                email: userInfo.user.email,
                profileImg: userInfo.user.profileImg,
                reviewNum: userInfo.reviews,
                pinNum: userInfo.pins
            }
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Get api/user/reviews
 *  @desc get my review list
 *  @access Private
 */
router.get("/reviews", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myReviewList = yield reviewService.getMyReviews(res.locals.userId);
        if (!myReviewList)
            return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            message: responseMessage.READ_MY_REVIEW_SUCCESS,
            reviews: myReviewList
        });
    }
    catch (error) {
        return next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=user.js.map