import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    cafeti: {
        cafetiIdx: {
            type: Number
        },
        type: {
            type: String
        },
        description: {
            type: String
        },
        img: {
            type: String
        } 
    },
    profileImg: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    }
},
{
    collection: "user"
});


export default mongoose.model<IUser & mongoose.Document>("User", UserSchema);