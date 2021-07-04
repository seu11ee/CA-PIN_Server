import express, { Request, Response } from "express";
const router = express.Router();
const cafeService = require("../services/cafeService");
const statusCode = require("../modules/statusCode");

/*
테스트용 api
**/
router.get(
    "/",
    async(req: Request, res: Response) => {
        const tagQuery = req.query.tags;
        try {
            if (tagQuery){
                var tags: number[] = (tagQuery).split(",").map(x=>+x);
                console.log(tags);
                const filtedCafeLocationList = await cafeService.getFilteredCafeLocationList(tags);
                if (filtedCafeLocationList.length == 0){
                    return res.status(statusCode.empty);
                }
                return res.status(statusCode.OK).json({
                    message: "태그로 카페 위치 리스트 조회 성공",
                    cafes: filtedCafeLocationList
                });
            }
            else{
                
                const cafeLocationList = await cafeService.getCafeLocationList();
                if (cafeLocationList.length == 0){
                    return res.status(statusCode.empty);
                }
                return res.status(statusCode.OK).json({
                    message: "카페 위치 리스트 조회 성공",
                    cafes: cafeLocationList
                });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send({message:"Server Error"});
        }
        // const tag = "60dc1623d2c7be7b98198014"
        // const tag2 = "60dc17698a5e06c2a33645d2"
        // console.log(req.query.tags);
        // console.log(req.query.userid);
        // try{
            // var cafes = await Cafe.find().populate({
            //     path:"tags",
            //     match:{ _id:tag}
            // });
            // const cafeList
        //     if (req.query.tags){
        //         const cafeList = await 
    
        //         if (!cafes){
        //             return res.status(204).send();
        //         }
        //         return res.json({cafes:cafes});
        //     }
        //     else{
        //         var cafes = await Cafe.find();
        //         return res.json({cafes:cafes});
        //     }
            
            
        // } catch (error){
        //     console.error(error.message);
        //     res.status(500).send({message:"Server Error"});
        // }
    }
)



module.exports = router;
