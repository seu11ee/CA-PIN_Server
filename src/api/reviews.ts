import express, { Request, Response } from "express";
import mongoose from "mongoose";
const router = express.Router();
const cafeService = require("../services/cafeService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

/**
 *  @route GET reviews/:cafeId
 *  @desc get a cafe review list
 *  @access Public
 */

router.get(
    "/:cafeId",
    async(req: Request, res: Response) => {
        const cafeId = req.params.cafeId;
    
    }
)
