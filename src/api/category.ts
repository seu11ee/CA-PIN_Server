import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
import authChecker from "../middleware/auth"
const router = express.Router();
const createError = require('http-errors');
const categoryService = require("../services/categoryService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");



/**
 *  @route Post api/category
 *  @desc generate category(카테고리 생성)
 *  @access Private
 */
router.post(
    "/",
    [
        check("colorIdx", "color_id is required").not().isEmpty(),
        check("categoryName", "color_name is required").not().isEmpty(),
    ],
    authChecker,
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const {colorIdx, categoryName} = req.body;

        try {
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            const category = await categoryService.createCategory(res.locals.userId, colorIdx, categoryName, false);  
            res.status(statusCode.CREATED).json({
                message: responseMessage.CREATE_CATEGORY_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 *  @route Post api/category/pin
 *  @desc generate category(카테고리에 카페 추가)
 *  @access Private
 */
 router.post(
    "/pin",
    [
        check("cafeIds", "cafe_ids is required").not().isEmpty(),
        check("categoryId", "category_id is required").not().isEmpty(),
    ],
    authChecker,
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }
        const {cafeIds, categoryId} = req.body;

        try {
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            await categoryService.addCafe(cafeIds, categoryId);  
            return res.status(statusCode.OK).json({
                message: responseMessage.ADD_PIN_SUCCESS
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Delete api/category/
 *  @desc generate category(카테고리에 카페 추가)
 *  @access Private
 */
 router.delete(
    "/:categoryId",
    [
        check("categoryId", "categoryId is required").not().isEmpty(),
    ],
    authChecker,
    async(req: Request, res: Response, next) => {
        const categoryId = req.params.categoryId;
        try {
            if (!mongoose.isValidObjectId(categoryId)){
                return next(createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER));
            }
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            await categoryService.deleteCategory(categoryId);
            return res.status(statusCode.OK).json({
                message: responseMessage.DELETE_CATEGORY_SUCCESS
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Get api/category/
 *  @desc fetch cafes in category(카테고리에 핀된 카페들 모아보기)
 *  @access Private
 */
 router.get(
    "/:categoryId/cafes",
    authChecker
    ,
    async(req: Request, res: Response, next) => {
        const categoryId = req.params.categoryId;
        try {
            if (!mongoose.isValidObjectId(categoryId)){
                return next(createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER));
            }
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            const cafeList = await categoryService.fetchCafesInCategory(categoryId, res.locals.userId);
            return res.status(statusCode.OK).json({
                message: responseMessage.READ_CATEGORY_CAFE_SUCCESS,
                cafeDetail: cafeList
            });
        } catch (error) {
            return next(error);
        }
    }
);


module.exports = router;