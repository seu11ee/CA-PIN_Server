import createError from "http-errors";
import mongoose from "mongoose";
import Cafe from "../models/Cafe";
import express, { Request, Response } from "express";
import axios from "axios";
const router = express.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const cafeService = require("../services/cafeService");
const {upload} = require("../middleware/upload");
import config from "../config";

router.put(
    "/cafes/:cafeId/image",
    upload.single("img"),
    async(req: Request, res: Response, next) => {
        const adminKey = config.adminSecretKey
        if(!req.header || !req.file ){
            return next(createError(createError(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE)));
        }
        if (req.header("adminKey") != adminKey){
            return next(createError(createError(statusCode.UNAUTHORIZED,responseMessage.UNAUTHORIZED)));
        }
        const cafeId = req.params.cafeId
        if (!cafeId) return next(createError(createError(statusCode.BAD_REQUEST,responseMessage.OUT_OF_VALUE)));
        const cafe = await cafeService.updateCafeImage(cafeId,(req.file as any).location)
        if (!cafe) return res.status(statusCode.NO_CONTENT).send();
        return res.status(statusCode.OK).json({
            message:"카페 이미지 업로드 성공"
        })
    }
);

module.exports = router;