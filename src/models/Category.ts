import mongoose from "mongoose";
import { ICategory } from "../interfaces/ICategory";

const CategorySchema = new mongoose.Schema ({
    cafes:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Cafe",
        required: true
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
    },
    isDefault: {
        type: Boolean,
        required: true
    }
},
{
    collection: "category",
    versionKey: false
});


export default mongoose.model<ICategory & mongoose.Document>("Category", CategorySchema);