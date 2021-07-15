import mongoose from "mongoose";
import {ICafeLocationDTO, ICafeAllDTO,ICafe} from "../interfaces/ICafe";
export interface ICategory {
    cafes: [ICafe];
    user: mongoose.Types.ObjectId;
    color: string;
    name: string;
    isDefault: boolean;
}

export interface IMyCafeCategoryDTO {
    cafes: [ICafeLocationDTO];
    color: string;
    name: string;
}

export interface IMyCafeCategoryAllDTO {
    cafes: [ICafeAllDTO];
    _id?: mongoose.Types.ObjectId;
    color: string;
    name: string;
    isPin?: boolean;
}