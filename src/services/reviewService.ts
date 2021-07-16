import Review from "../models/Review";
import { IReviewOutputDTO, IWriterDTO, IReviewMyOutputDTO } from "../interfaces/IReview";
import mongoose from "mongoose";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
import createError from "http-errors";
const koreanDate = require("../modules/dateCalculate");
import Cafe from "../models/Cafe";
const getCafeReviewList = async(cafeId) => {

    const reviews = await Review.find().where("cafe").equals(cafeId).populate("user",["_id", "nickname", "profileImg" ,"cafeti"]).sort({created_at:-1});
    let reviewDTOList: IReviewOutputDTO[] = []

    for (let review of reviews){
        if (!review.user.profileImg){
            review.user.profileImg = review.user.cafeti.plainImg;
        }
        let writerDTO: IWriterDTO = {
            _id: review.user._id,
            nickname: review.user.nickname,
            profileImg: review.user.profileImg
        }
        let reviewDTO: IReviewOutputDTO = {
            _id: review._id,
            cafeId: review.cafe._id,
            writer: writerDTO,
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
        if (!review) return null;
        // if (review.user != userId){
        //     throw createError(statusCode.UNAUTHORIZED,responseMessage.UNAUTHORIZED);
        // }
        review.content = content;
        review.rating = rating;
        review.recommend = recommend;
        review.updated_at = koreanDate.getDate();
        if (!isAllDeleted && imgs.length != 0){
            review.imgs = imgs
        }
        else if (isAllDeleted){
            review.imgs = undefined;
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
        if (review.user != userId){
            throw createError(statusCode.UNAUTHORIZED,responseMessage.UNAUTHORIZED);
        }
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

const updateCafeAverageRating = async(cafeId) => {
    const reviews = await Review.aggregate([
        
        {
            $match: 
            {
                cafe : mongoose.Types.ObjectId(cafeId)
            }
        },

        {
            $group:
            {
                _id : "$cafe",
                average: { $avg: "$rating" }

            }
        }
        
    ]);

    var cafeRating = undefined;
    if (reviews.length != 0){
        cafeRating = reviews[0].average;
    }
    cafeRating = Number(cafeRating.toFixed(1));
    await Cafe.findByIdAndUpdate(cafeId,{
        rating:cafeRating
    },{ 
        new: true,
        useFindAndModify: false
    })
}

const getMyReviews = async (userId) => {
    const myReviews = await Review.find({user:userId}).populate("cafe").sort({created_at:-1})
    var myReviewsDTO: IReviewMyOutputDTO[] = []
    for (let review of myReviews){
        let myReview: IReviewMyOutputDTO = {
            _id: review._id,
            cafeName: review.cafe.name,
            cafeId: review.cafe._id,
            content: review.content,
            rating: review.rating,
            create_at: review.created_at,
            imgs: review.imgs,
            recommend: review.recommend
        }
        myReviewsDTO.push(myReview);
        
    }

    return myReviewsDTO
}

module.exports = {
    getCafeReviewList,
    checkIfReviewed,
    createReview,
    modifyReview,
    deleteReview,
    updateCafeAverageRating,
    getMyReviews
}