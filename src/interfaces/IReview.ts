import mongoose from "mongoose";
import { ICafe } from "./ICafe";
import { IUserReviewDTO, IUser } from "./IUser";

export interface IReview{
    cafe: ICafe;
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

export interface IReviewMyOutputDTO{
    _id: string;
    cafeName: string;
    cafeId: string;
    content: string;
    rating: number;
    create_at: Date;
    recommend?: number[];
    imgs?: string[];
}