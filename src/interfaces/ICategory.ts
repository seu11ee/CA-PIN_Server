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
    _id?: mongoose.Types.ObjectId;
    cafes: [ICafeLocationDTO];
    color: string;
    name: string;
    isPin?: boolean;
}

export interface IMyCafeCategoryAllDTO {
    cafes: [ICafeAllDTO];
    color: string;
    name: string;
}
