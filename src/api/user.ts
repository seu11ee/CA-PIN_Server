import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
const router = express.Router();

const userService = require("../services/userService");
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
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        try {
            const user = await userService.loginUser(email, password);
            const userToken = await userService.generateToken(user._id);
            return res.status(statusCode.OK).json({
                user: {
                    nickname: user.nickname,
                    token: userToken
                },
                message: responseMessage.SIGN_IN_SUCCESS
            });
        } catch (error) {
            switch (error.message) {
                case responseMessage.NO_EMAIL:
                    res.status(400).send({message: error.message});
                    break;
                case responseMessage.MISS_MATCH_PW:
                    res.status(400).send({message: error.message});
                    break;
                default:
                    res.status(500).send({message: responseMessage.INTERNAL_SERVER_ERROR});
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
            return res.status(400).json({errors: errors.array()});
        }

        const {nickname, email, password} = req.body;

        try {
            const user = await userService.signupUser(nickname, email, password);
            // const token
            return res.status(statusCode.OK).json({
                message: responseMessage.SIGN_UP_SUCCESS
            });

        } catch (error) {
            switch (error.message) {
                case responseMessage.ALREADY_EMAIL:
                    res.status(400).send({message: error.message});
                    break;
                case responseMessage.ALREADY_NICKNAME:
                    res.status(400).send({message: error.message});
                    break;
                default:
                    res.status(500).send({message: responseMessage.INTERNAL_SERVER_ERROR});
            }
        }
    }
);

module.exports = router;