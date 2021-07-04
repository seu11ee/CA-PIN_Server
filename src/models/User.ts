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
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
    },
    created_at: {
        type: Date,
        required: true,
    },
    deleted_at: {
        type: Date,
        required: true,
    }
},
{
    collection: "user"
});


export default mongoose.model<IUser & mongoose.Document>("User", UserSchema);