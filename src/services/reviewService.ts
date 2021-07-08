import Review from "../models/Review";
import { IReviewOutputDTO } from "../interfaces/IReview";
import mongoose from "mongoose";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
import createError from "http-errors";
const koreanDate = require("../modules/dateCalculate");

const getCafeReviewList = async(cafeId) => {

    const reviews = await Review.find().where("cafe").equals(cafeId).populate("user",["_id", "nickname", "profileImg" ,"cafeti"]);
    let reviewDTOList: IReviewOutputDTO[] = []

    for (let review of reviews){
        if (!review.user.profileImg){
            review.user.profileImg = review.user.cafeti.img;
        }

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

    return reviewDTOList;
}

const checkIfReviewed = async (cafeId,userId) => {
    const review = await Review.findOne({cafe:cafeId,user:userId})
    if (!review) return false;
    return true;
}

const createReview = async (cafeId,userId,content,rating,recommend?,imgs?) => {
    try {
        const review = new Review({
            user: userId,
            cafe: cafeId,
            content: content,
            recommend: recommend,
            rating: rating,
            imgs:imgs,
            created_at: koreanDate.getDate()
        });

        await review.save();

        return review;
     
        
    } catch (error) {
        console.log(error.message);
        throw createError(responseMessage.INTERNAL_SERVER_ERROR);
    }
}

const modifyReview = async (reviewId,userId,content,rating,isAllDeleted,recommend?,imgs?) => {
    try {
        const review = await Review.findById(reviewId);
        console.log(statusCode.UNAUTHORIZED);
        if (!review) return null;
        if (review.user != userId){
            throw createError(statusCode.UNAUTHORIZED,responseMessage.UNAUTHORIZED);
        }
        review.content = content;
        review.rating = rating;
        review.recommend = recommend;
        review.updated_at = koreanDate.getDate();
        if (!isAllDeleted && imgs.length != 0){
            review.imgs = imgs
        }
        else if (isAllDeleted){
            review.imgs = [];
        }
        await review.save();
 
        return review;

    } catch (error) {
        console.log(error.message);
        throw error;
    }

    
}

const deleteReview = async (reviewId,userId) => {
    try{
        const review = await Review.findById(reviewId);
        if (!review) return null;
        const deletedReview = await Review.remove({_id: reviewId}, function(err) {
            if (err) {
                throw err;
            }
        });
        return deletedReview;
    } catch (error) {
        throw(error);
    }
}

module.exports = {
    getCafeReviewList,
    checkIfReviewed,
    createReview,
    modifyReview,
    deleteReview
}