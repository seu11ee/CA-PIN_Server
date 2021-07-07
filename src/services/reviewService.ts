import Review from "../models/Review";
import { IReviewOutputDTO } from "../interfaces/IReview";
import mongoose from "mongoose";
const responseMessage = require("../modules/responseMessage");

const getCafeReviewList = async(cafeId) => {
    const reviews = await Review.find().where("cafe").equals(cafeId).populate("user");

    let reviewDTOList: IReviewOutputDTO[] = []

    for (let review of reviews){
        let reviewDTO: IReviewOutputDTO = {
            _id: review._id,
            cafe: review.cafe,
            user: review.user,
            rating: review.rating,
            created_at: review.created_at,
            content: review.content
        }
        if (review.imgs){
            reviewDTO.imgs = review.imgs
        }
        if (review.recommend){
            reviewDTO.recommend = review.recommend
        }
        reviewDTOList.push(reviewDTO);
    }
    
    if (reviewDTOList.length == 0){
        throw Error(responseMessage.NO_CONTENT);
    }

    return reviewDTOList;
}

module.exports = {
    getCafeReviewList
}