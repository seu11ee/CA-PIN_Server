import createError from "http-errors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
const router = express.Router();
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const cafeService = require("../services/cafeService");

router.get(
    "/cafe",
    async(req: Request, res: Response, next) => {
        const searchQuery = req.query.query;
        if (searchQuery){
            return res.status(statusCode.NO_CONTENT).send();
        }
        try {
            const cafes = cafeService.getCafeByName(searchQuery);
            if (!cafes) return res.status(statusCode.NO_CONTENT).send();
            return res.status(statusCode.OK).json({
                "message" : responseMessage.SEARCH_SUCCESS,
                "searchResults" : cafes
            });

        } catch (error) {
            next(error);
        }
    }
)