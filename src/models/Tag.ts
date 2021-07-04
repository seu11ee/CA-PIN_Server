import { MongoServerSelectionError } from "mongodb";
import mongoose from "mongoose";
import { ITag } from "../interfaces/ITag";

const TagSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    tagIdx:{
        type: Number,
        required: true,
        unique: true,
        index: true
    }
},
{
    collection: "tags"
});

export default mongoose.model<ITag & mongoose.Document>("Tag",TagSchema);