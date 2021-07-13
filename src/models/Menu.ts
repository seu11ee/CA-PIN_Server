import mongoose from "mongoose";
import {IMenu} from "../interfaces/IMenu";

const MenuSchema = new mongoose.Schema({
    cafe: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Cafe",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},
{
    collection: "menus",
    versionKey: false
});

export default mongoose.model<IMenu & mongoose.Document>("Menu",MenuSchema);