import mongoose from "mongoose";

export interface IReview{
    cafe: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    created_at: Date;
    updated_at?: Date;
    imgs?: [string];
    recommend?: [number];
    content: string;
}

export interface IReviewOutputDTO{
    _id: string;
    cafe: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    created_at: Date;
    imgs?: [string];
    recommend?: [number];
    content: string;
}