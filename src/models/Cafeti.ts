import mongoose from "mongoose";
import { ICafeti } from "../interfaces/ICafeti";

const CafetiSchema = new mongoose.Schema ({
    cafetiIdx: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
},
{
    collection: "cafeti"
});


export default mongoose.model<ICafeti & mongoose.Document>("Cafeti", CafetiSchema);