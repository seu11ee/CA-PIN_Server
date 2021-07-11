import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
import authChecker from "../middleware/auth"
const router = express.Router();
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const categoryService = require("../services/categoryService");



/**
 *  @route Post category/
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
        const userId = res.locals.userId
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const {colorIdx, categoryName} = req.body;

        try {
            await categoryService.createCategory(userId, colorIdx, categoryName, false);  
            return res.status(statusCode.CREATED).json({
                message: responseMessage.CREATE_CATEGORY_SUCCESS
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route Post /category/:categoryId/pin
 *  @desc generate category(카테고리에 카페 추가)
 *  @access Private
 */
 router.post(
    "/:categoryId/archive",
    [
        check("cafeIds", "cafe_ids is required").not().isEmpty(),
    ],
    authChecker,
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const categoryId = req.params.categoryId;
        const {cafeIds} = req.body;

        try {
            if (!mongoose.isValidObjectId(categoryId)){
                return next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
            }

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
 *  @route Delete category/:categoryId
 *  @desc delete category(카테고리 삭제)
 *  @access Private
 */
 router.delete(
    "/:categoryId",
    authChecker,
    async(req: Request, res: Response, next) => {
        const categoryId = req.params.categoryId;
        try {
            if (!mongoose.isValidObjectId(categoryId)){
                return next(createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER));
            }
            
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
 *  @route Get category/:categoryId/cafes
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