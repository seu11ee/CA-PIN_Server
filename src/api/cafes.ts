import express, { Request, Response } from "express";
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



module.exports = router;
