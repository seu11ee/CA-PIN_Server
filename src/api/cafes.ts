import auth from "../middleware/auth";
import createError from "http-errors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { ICafeAllDTO } from "../interfaces/ICafe";
const router = express.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const cafeService = require("../services/cafeService");
const categoryService = require("../services/categoryService");
const reviewService = require("../services/reviewService");
const menuService = require("../services/menuService");

/**
 *  @route GET cafes?tags={tagIndex},..,{}
 *  @desc get a cafe location list
 *  @access Public
 */
router.get(
    "/",
    async(req: Request, res: Response, next) => {
        const tagQuery = req.query.tags;
        var tags = undefined
        if (tagQuery){
            if (tagQuery.length == 1) tags = [tagQuery]
            else tags = (tagQuery as string[]).map(x=>+x);
        }
        else tags = [];

        try {
            
            const cafeLocationList = await cafeService.getCafeLocationList(tags);

            if (!cafeLocationList) return res.status(statusCode.NO_CONTENT).send();
            
            return res.status(statusCode.OK).json({
                message: responseMessage.CAFE_LOCATION_SUCCESS,
                cafeLocations: cafeLocationList
            });
        } catch (error) {
            next(error);
        }
      
    
    }
);

/**
 *  @route GET cafes/:cafeId
 *  @desc get a cafe detail
 *  @access Private
 */
router.get(
    "/detail/:cafeId", auth,
    async(req: Request, res: Response, next) => {
        const cafeId = req.params.cafeId;
        const userId = res.locals.userId;

        try{
            if (!mongoose.isValidObjectId(cafeId)){
                return next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER));
            }
            else{
                const cafeDetail = await cafeService.getCafeDetail(cafeId);
                if (!cafeDetail) return res.status(statusCode.NO_CONTENT).send();
                const isSaved = await categoryService.checkCafeInCategory(cafeId,userId);
                var average: Number = await reviewService.getCafeAverageRating(cafeId);
                if (!average) return res.status(statusCode.OK).send({message:responseMessage.CAFE_DETAIL_SUCCESS,cafeDetail,isSaved})
                average = Number(average.toFixed(1))
                return res.status(statusCode.OK).send({message:responseMessage.CAFE_DETAIL_SUCCESS,cafeDetail,isSaved,average})
            }
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route GET cafes/myMap
 *  @desc get a my map cafe location list
 *  @access Private
 */
router.get(
    "/myMap", auth,
    async(req: Request, res: Response, next) => {
        const userId = res.locals.userId;

        try {
            const myMapList = await cafeService.getMyMapCafeList(userId);
            return res.status(statusCode.OK).json({
                message: responseMessage.MYMAP_LOCATION_SUCCESS,
                myMapLocations: myMapList
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 *  @route GET cafes/detail/:cafeId/menus
 *  @desc get a cafe menu list
 *  @access public
 */
router.get(
    "/:cafeId/menus",
    async(req: Request,res: Response,next) => {
        const cafeId = req.params.cafeId
        if (!cafeId) return(next(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE)));
        if (!mongoose.isValidObjectId(cafeId)) return (next(createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER)));
        try {
            const menuList = await menuService.getCafeMenuList(cafeId)
            if (!menuList) return res.status(statusCode.NO_CONTENT).send();
            return res.status(statusCode.OK).json({
                message: responseMessage.CAFE_MENU_SUCCESS,
                menus: menuList
            });
        } catch (error) {
            return next(error);
        }
    }
)
router.get(
    "/all",
    auth,
    async(req: Request, res: Response, next) => {
        const tagQuery = req.query.tags;
        const userId = res.locals.userId;
        var tags = undefined
        if (tagQuery){
            if (tagQuery.length == 1) tags = [tagQuery]
            else tags = (tagQuery as string[]).map(x=>+x);
        }
        else tags = [];

        try {
            
            const cafeLocationList = await cafeService.getCafeAllList(tags);
            if (!cafeLocationList) return res.status(statusCode.NO_CONTENT).send();
            
            return res.status(statusCode.OK).json({
                message:responseMessage.CAFE_DETAIL_SUCCESS,
                cafeLocations: cafeLocationList
            })
        } catch (error) {
            next(error);
        }
      
    
    }
);

module.exports = router;