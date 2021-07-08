import mongoose from "mongoose";

export interface ICafe{
    name: string;
    img: string;
    address: string;
    tags: mongoose.Types.ObjectId;
    latitude: number;
    longitude: number;
    instagram: string;
    opentime?: string;
    opentimeHoliday?: string;
    closetime?: string;
    closetimeHoliday?: string;
    offday?: [number];
    rating?: number;
}

export interface ICafeLocationDTO{
    _id: string;
    latitude: number;
    longitude: number;
}

export interface ICafeCategoryDTO{
    name: string;
    tags: mongoose.Types.ObjectId;
    address: string;
    rating?: number;
}
