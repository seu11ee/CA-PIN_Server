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
    rating: number;
}
