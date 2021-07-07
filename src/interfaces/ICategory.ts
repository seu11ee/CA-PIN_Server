import mongoose from "mongoose";
export interface ICategory {
    cafe: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    color: string;
    name: string;
    isDefault: boolean;
}