import express, { Request, Response } from "express";
const router = express.Router();

import Tag from "../models/Tag";
import Cafe from "../models/Cafe";
/*
테스트용 api
**/
router.get(
    "/",
    async(req: Request, res: Response) => {
        const tag = "60dc1623d2c7be7b98198014"
        const tag2 = "60dc17698a5e06c2a33645d2"
        console.log(req.query.tags);
        console.log(req.query.userid);
        try{
            // var cafes = await Cafe.find().populate({
            //     path:"tags",
            //     match:{ _id:tag}
            // });
            if (req.query.tags){
                var cafes = await Cafe.find({
                    tags:{"$all":[tag]}
                }).populate("tags");
    
                if (!cafes){
                    return res.status(204).send();
                }
                return res.json({cafes:cafes});
            }
            else{
                var cafes = await Cafe.find();
                return res.json({cafes:cafes});
            }
            
            
        } catch (error){
            console.error(error.message);
            res.status(500).send({message:"Server Error"});
        }
    }
)



module.exports = router;
