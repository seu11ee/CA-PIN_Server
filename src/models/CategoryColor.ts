import mongoose from "mongoose";
import { ICategoryColor } from "../interfaces/ICategoryColor";

const CategoryColorSchema = new mongoose.Schema ({
    color_idx:{
        type: Number,
        required: true,
        unique: true
    },
    color_code:{
        type: String,
        required: true,
        unique: true
    },
},
{
    collection: "category_colors",
    versionKey: false
});


export default mongoose.model<ICategoryColor & mongoose.Document>("CategoryColor", CategoryColorSchema);