import mongoose from "mongoose";
import { ICafe } from "../interfaces/ICafe";

const CafeSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true
  },
  img:{
      type: String,
      required: false
  },
  address:{
      type: String,
      required: true
  },
  tags:{
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "Tag",
      required: true
  },
  latitude:{
      type: Number,
      required: false
  },
  longitude:{
      type: Number,
      required: false
  },
  instagram:{
      type: String
  },
  opentime:{
      type: String
  },
  opentimeHoliday:{
      type: String
  },
  closetime:{
      type:String
  },
  closetimeHoliday:{
      type: String
  },
  offday:{
      type: [String],
      default: undefined
  },
  rating: {
      type: Number
  }


},
{
    collection: "cafes",
    versionKey: false
}
);

export default mongoose.model<ICafe & mongoose.Document>("Cafe", CafeSchema);