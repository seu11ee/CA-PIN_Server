import mongoose from "mongoose";
import { IUserReviewDTO, IUser } from "./IUser";

export interface IReview{
    cafe: mongoose.Types.ObjectId;
    user: IUserReviewDTO & mongoose.Document<any,any>;
    rating: number;
    created_at: Date;
    updated_at?: Date;
    imgs?: string[];
    recommend?: number[];
    content: string;
}

export interface IReviewOutputDTO{
    _id: string;
    cafeId: mongoose.Types.ObjectId;
    writer: IWriterDTO;
    rating: number;
    created_at: Date;
    imgs?: string[];
    recommend?: number[];
    content: string;
}

export interface IWriterDTO{
    _id: string;
    nickname: string;
    profileImg: string;
}