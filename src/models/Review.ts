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
        type: [String]
    },
    recommend:{
        type: [Number]
    },
    content:{
        type: String,
        required: true
    }

},
{
    collection: "reviews"
});

export default mongoose.model<mongoose.Document>("Review",ReviewSchema);