import express, { Request, Response } from "express";
import mongoose from "mongoose";
const router = express.Router();
const reviewService = require("../services/reviewService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

/**
 *  @route GET reviews/:cafeId
 *  @desc get a cafe review list
 *  @access Public
 */

router.get(
    "/",
    async(req: Request, res: Response) => {
        const cafeId = req.query.cafe;
        try{
            const reviews = await reviewService.getCafeReviewList(cafeId);
    
            return res.status(statusCode.OK).json({
                message:responseMessage.REVIEW_SUCCESS,
                reviews: reviews
            });
        } catch (error) {
            switch (error.message){
                case responseMessage.INVALID_IDENTIFIER:
                    res.status(statusCode.BAD_REQUEST).send({message:error.message});
                case responseMessage.NO_CONTENT:
                    res.status(statusCode.NO_CONTENT).send();
                default:
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send({message:responseMessage.INTERNAL_SERVER_ERROR});
            }
        }
    }
)

module.exports = router;