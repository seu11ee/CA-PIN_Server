import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
import authChecker from "../middleware/auth"
const router = express.Router();
const createError = require('http-errors');
const cafetiService = require("../services/cafetiService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

/**
 *  @route Post /cafeti/
 *  @desc Do Cafeti test(카페티아이 검사)
 *  @access Private
 */
 router.post(
    "/",
    [
        check("answers", "answers is required").not().isEmpty(),
    ],
    authChecker
    ,
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            next(createError(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE));
        }

        const {answers} = req.body;

        try {
            const result = await cafetiService.fetchCafetiResult(res.locals.userId, answers);
            res.status(statusCode.OK).json({
                message: responseMessage.CAFETI_TEST_SUCCESS,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;