import mongoose from "mongoose";
import { IReview } from "../interfaces/IReview";

const ReviewSchema = new mongoose.Schema({
    cafe:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Cafe",
        required: true
    },
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    created_at:{
        type: Date,
        required: true
    },
    updated_at:{
        type: Date
    },
    imgs:{
        type: [String],
        default: undefined

    },
    recommend:{
        type: [Number],
        default: undefined

    },
    content:{
        type: String,
        required: true
    }

},
{
    collection: "reviews",
    versionKey: false
});

export default mongoose.model<IReview & mongoose.Document>("Review",ReviewSchema);