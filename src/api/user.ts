import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
import authChecker from "../middleware/auth"
const router = express.Router();
const createError = require('http-errors');

const userService = require("../services/userService");
const categoryService = require("../services/categoryService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const reviewService = require("../services/reviewService");

/**
 *  @route Post api/user/login
 *  @desc Authenticate user & get token(로그인)
 *  @access Public
 */
router.post(
    "/login",
    [
        check("email", "Please include a valid email").not().isEmpty(),
        check("password", "password is required").not().isEmpty(),
    ],
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            next(createError(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE));
        }

        const {email, password} = req.body;

        try {
            const user = await userService.loginUser(email, password);
            const userToken = await userService.generateToken(user._id);
            res.status(statusCode.OK).json({
                message: responseMessage.SIGN_IN_SUCCESS,
                loginData: {
                    nickname: user.nickname,
                    token: userToken
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 *  @route Post api/user/signup
 *  @desc generate user(회원가입)
 *  @access Public
 */
router.post(
    "/signup",
    [
        check("nickname", "nickname is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "password is required").not().isEmpty(),
    ],
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            next(createError(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE));
        }

        const {nickname, email, password} = req.body;

        try {
            await userService.signupUser(nickname, email, password);

            return res.status(statusCode.CREATED).json({
                message: responseMessage.SIGN_UP_SUCCESS
            });

        } catch (error) {
            next(error);
        }
    }
);

/**
 *  @route Get api/user/categoryList
 *  @desc fetch my category list(내 카테고리-마이페이지)
 *  @access Private
 */
 router.get(
    "/categoryList",
    authChecker
    ,
    async(req: Request, res: Response, next) => {
        try {
            const myCategoryList = await categoryService.fetchMyCategory(res.locals.userId);
            return res.status(statusCode.OK).json({
                message: responseMessage.READ_MY_CATEGORY_SUCCESS,
                myCategoryList: myCategoryList
            });

        } catch (error) {
            next(error);
        }
    }
);

/**
 *  @route Get api/user/reviews
 *  @desc get my review list
 *  @access Private
 */
router.get("/reviews",
    authChecker,
    async(req: Request, res: Response, next) => {
        try {
            const myReviewList = await reviewService.getMyReviews(res.locals.userId);
            if (!myReviewList) return res.status(statusCode.NO_CONTENT).send();
            return res.status(statusCode.OK).json({
                message: responseMessage.READ_MY_REVIEW_SUCCESS,
                reviews: myReviewList
            });

        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;