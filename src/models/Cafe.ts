import mongoose from "mongoose";
import { ICafe } from "../interfaces/ICafe";

const CafeSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true
  },
  img:{
      type: String
  },
  address:{
      type: String
  },
  tags:{
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "Tag"
  },
  latitude:{
      type: Number,
      required: true
  },
  longitude:{
      type: Number,
      required: true
  },
  instagram:{
      type: String
  },
  opentime:{
      type: String
  },
  closetime:{
      type:String
  },
  offday:{
      type:[Number]
  }


},
{
    collection: "cafes"
});

export default mongoose.model<mongoose.Document>("Cafe", CafeSchema);