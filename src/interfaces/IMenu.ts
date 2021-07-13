import mongoose from "mongoose";
import {ICafe} from "./ICafe";
export interface IMenu{
    _id: string;
    cafe: ICafe;
    name: string;
    price: number;
}

export interface IMenuOutputDTO{
    name: string;
    price: number;
}