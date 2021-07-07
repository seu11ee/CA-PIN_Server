import mongoose from "mongoose";
import { ICategory } from "../interfaces/ICategory";

const CategorySchema = new mongoose.Schema ({
    cafe:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Cafe",
    },
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    color: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},
{
    collection: "category"
});


export default mongoose.model<ICategory & mongoose.Document>("Category", CategorySchema);