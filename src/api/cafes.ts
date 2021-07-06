import express, { Request, Response } from "express";
import mongoose from "mongoose";
const router = express.Router();
const cafeService = require("../services/cafeService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

/*
테스트용 api
**/
router.get(
    "/",
    async(req: Request, res: Response) => {
        const tagQuery = req.query.tags;
        var tags: number[] = []
        try {
            if (tagQuery){
                tags = (tagQuery).split(",").map(x=>+x);
            }
            const cafeLocationList = await cafeService.getCafeLocationList(tags);
            if (cafeLocationList.length == 0){
                return res.status(statusCode.NO_CONTENT).send();
            }
            return res.status(statusCode.OK).json({
                message: responseMessage.CAFE_LOCATION_SUCCESS,
                cafes: cafeLocationList
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send({message: responseMessage.INTERNAL_SERVER_ERROR});
        }
      
    
    }
)

router.get(
    "/:cafeId",
    async(req: Request, res: Response) => {
        const cafeId = req.params.cafeId;
        
        try{
            if (!mongoose.isValidObjectId(cafeId)){
                console.log("invalid");
                throw(Error(responseMessage.INVALID_IDENTIFIER));
            }
            else{
                const cafeDetail = await cafeService.getCafeDetail(cafeId);
                res.status(statusCode.OK).send({message:responseMessage.CAFE_DETAIL_SUCCESS,cafeDetail})
            }
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
    })



module.exports = router;
