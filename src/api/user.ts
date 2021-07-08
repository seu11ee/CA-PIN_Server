import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
import authChecker from "../middleware/auth"
const router = express.Router();

const userService = require("../services/userService");
const categoryService = require("../services/categoryService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

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
    async(req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(statusCode.BAD_REQUEST).json({errors: errors.array()});
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
            switch (error.message) {
                case responseMessage.NO_EMAIL:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                case responseMessage.MISS_MATCH_PW:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                default:
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send({message: responseMessage.INTERNAL_SERVER_ERROR});
            }
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
    async(req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(statusCode.BAD_REQUEST).json({errors: errors.array()});
        }

        const {nickname, email, password} = req.body;

        try {
            await userService.signupUser(nickname, email, password);

            return res.status(statusCode.CREATED).json({
                message: responseMessage.SIGN_UP_SUCCESS
            });

        } catch (error) {
            switch (error.message) {
                case responseMessage.ALREADY_EMAIL:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                case responseMessage.ALREADY_NICKNAME:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                default:
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send({message: responseMessage.INTERNAL_SERVER_ERROR});
            }
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
    async(req: Request, res: Response) => {
        try {
            const myCategoryList = await categoryService.fetchMyCategory(res.locals.userId);
            return res.status(statusCode.OK).json({
                message: responseMessage.READ_MY_CATEGORY_SUCCESS,
                myCategoryList: myCategoryList
            });

        } catch (error) {
            switch (error.message) {
                case responseMessage.INVALID_IDENTIFIER:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                default:
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send({message: responseMessage.INTERNAL_SERVER_ERROR});
            }
        }
    }
);



module.exports = router;