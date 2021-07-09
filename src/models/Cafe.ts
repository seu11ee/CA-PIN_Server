import mongoose from "mongoose";
import { ICafe } from "../interfaces/ICafe";

const CafeSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true
  },
  img:{
      type: String,
      required: true
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
      type:[Number],
      default: undefined
  }


},
{
    collection: "cafes"
});

export default mongoose.model<ICafe & mongoose.Document>("Cafe", CafeSchema);