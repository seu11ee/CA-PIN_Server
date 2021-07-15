import mongoose from "mongoose";
import {ICafeLocationDTO} from "../interfaces/ICafe";
export interface ICategory {
    cafes: [mongoose.Types.ObjectId];
    user: mongoose.Types.ObjectId;
    color: string;
    name: string;
    isDefault: boolean;
}

export interface IMyCafeCategoryDTO {
    _id?: mongoose.Types.ObjectId;
    cafes: [mongoose.Types.ObjectId];
    color: string;
    name: string;
    isPin?: boolean;
}