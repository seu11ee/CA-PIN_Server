import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator"
import authChecker from "../middleware/auth"
const router = express.Router();
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
            return res.status(statusCode.BAD_REQUEST).json({errors: errors.array()});
        }

        const {colorIdx, categoryName} = req.body;

        try {
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            const category = await categoryService.createCategory(res.locals.userId, colorIdx, categoryName, false);  
            res.status(statusCode.CREATED).json({
                message: responseMessage.CREATE_CATEGORY_SUCCESS
            });
            next();

        } catch (error) {
            switch (error.message) {
                case responseMessage.OUT_OF_VALUE:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                default:
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send({message: error.message});
            }
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
            return res.status(statusCode.BAD_REQUEST).json({errors: errors.array()});
        }

        const {cafeIds, categoryId} = req.body;

        try {
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            await categoryService.addCafe(cafeIds, categoryId);  
            res.status(statusCode.OK).json({
                message: responseMessage.ADD_PIN_SUCCESS
            });
            next();

        } catch (error) {
            switch (error.message) {
                case responseMessage.BAD_REQUEST:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                case responseMessage.INVALID_IDENTIFIER:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                default:
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send({message: error.message});
            }
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
                throw(Error(responseMessage.INVALID_IDENTIFIER));
            }
            else{
                console.log(res.locals.tokenValue);
                console.log(res.locals.userId);
                await categoryService.deleteCategory(categoryId);
                res.status(statusCode.OK).json({
                    message: responseMessage.DELETE_CATEGORY_SUCCESS
                });
                next();
            }
        } catch (error) {
            switch (error.message) {
                case responseMessage.DELETE_DEFAULT_FAIL:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                case responseMessage.INVALID_IDENTIFIER:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                default:
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send({message: error.message});
            }
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
                throw(Error(responseMessage.INVALID_IDENTIFIER));
            }
            else{
                console.log(res.locals.tokenValue);
                console.log(res.locals.userId);
                const cafeList = await categoryService.fetchCafesInCategory(categoryId, res.locals.userId);
                res.status(statusCode.OK).json({
                    message: responseMessage.READ_CATEGORY_CAFE_SUCCESS,
                    cafeDetail: cafeList
                });
                next();
            }
        } catch (error) {
            switch (error.message) {
                case responseMessage.INVALID_IDENTIFIER:
                    res.status(statusCode.BAD_REQUEST).send({message: error.message});
                    break;
                default:
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send({message: error.message});
            }
        }
    }
);


module.exports = router;