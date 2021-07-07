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
        check("color_id", "color_id is required").not().isEmpty(),
        check("category_name", "color_name is required").not().isEmpty(),
    ],
    authChecker,
    async(req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(statusCode.BAD_REQUEST).json({errors: errors.array()});
        }

        const {color_id, category_name} = req.body;

        try {
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            const category = await categoryService.createCategory(res.locals.userId, color_id, category_name);  
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

module.exports = router;