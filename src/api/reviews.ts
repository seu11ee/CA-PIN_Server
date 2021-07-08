import express, { Request, Response } from "express";
import mongoose from "mongoose";
const router = express.Router();
const reviewService = require("../services/reviewService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
import auth from "../middleware/auth";
import createError from "http-errors";

/**
 *  @route GET reviews/:cafeId
 *  @desc get a cafe review list
 *  @access Public
 */

router.get(
    "/",auth,
    async(req: Request, res: Response,next) => {
        const cafeId = req.query.cafe;
        const userId = res.locals.userId;

        if (!cafeId || !mongoose.isValidObjectId(cafeId)){
            next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
        }

        try{
            const reviews = await reviewService.getCafeReviewList(cafeId);
            if (reviews.length == 0){
                res.status(statusCode.NO_CONTENT).json();
                next();
            }
            const isReviewed = await reviewService.checkIfReviewed(cafeId,userId);
            return res.status(statusCode.OK).json({
                message:responseMessage.READ_CAFE_REVIEW_SUCCESS,
                reviews: reviews,
                isReviewed:isReviewed
            });
        } catch (error) {
            next(error);
        }
    }
)

router.post(
    "/:reviewId",
    async(req: Request, res: Response) => {
        const reviewId = req.params.reviewId;
    }
)

module.exports = router;