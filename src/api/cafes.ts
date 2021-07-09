import auth from "../middleware/auth";
import createError from "http-errors";
import express, { Request, response, Response } from "express";
import mongoose from "mongoose";
const cafeService = require("../services/cafeService");
const categoryService = require("../services/categoryService");
const responseMessage = require("../modules/responseMessage");
const reviewService = require("../services/reviewService");
const router = express.Router();
const statusCode = require("../modules/statusCode");

/**
 *  @route GET cafes?tags={tagIndex},..,{}
 *  @desc get a cafe location list
 *  @access Public
 */
router.get(
    "/",
    async(req: Request, res: Response, next) => {
        const tagQuery = req.query.tags;
        var tags: number[] = []
        try {
            if (tagQuery){
                tags = (tagQuery as string).split(",").map(x=>+x);
            }
            const cafeLocationList = await cafeService.getCafeLocationList(tags);

            if (!cafeLocationList) res.status(statusCode.NO_CONTENT).send();
            
            return res.status(statusCode.OK).json({
                message: responseMessage.CAFE_LOCATION_SUCCESS,
                cafeLocations: cafeLocationList
            });
        } catch (error) {
            next(error);
        }
      
    
    }
)

/**
 *  @route GET cafes/:cafeId
 *  @desc get a cafe detail
 *  @access Private
 */
router.get(
    "/:cafeId", auth,
    async(req: Request, res: Response, next) => {
        const cafeId = req.params.cafeId;
        const userId = res.locals.userId;

        try{
            if (!mongoose.isValidObjectId(cafeId)){
                next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
            }
            else{
                const cafeDetail = await cafeService.getCafeDetail(cafeId);
                if (!cafeDetail) res.status(statusCode.NO_CONTENT).send();
                const isSaved = await categoryService.checkCafeInCategory(cafeId,userId);
                const average = await reviewService.getCafeAverageRating(cafeId);
                res.status(statusCode.OK).send({message:responseMessage.CAFE_DETAIL_SUCCESS,cafeDetail,isSaved,average})
            }
        } catch (error) {
            next(error);
        }
    })



module.exports = router;
