import Cafe from "../models/Cafe";
import Tag from "../models/Tag";
import { ICafe, ICafeLocationDTO } from "../interfaces/ICafe";
import mongoose from "mongoose";


const getCafeLocationList =  async () => {
    const cafes = await Cafe.find().select("_id latitude longitude");;
    var cafeLocationList: ICafeLocationDTO[] = [];
    for (let cafe of cafes){
        let locationDTO: ICafeLocationDTO = {
            _id: cafe._id,
            latitude: cafe.latitude,
            longitude: cafe.longitude
        }
        cafeLocationList.push(locationDTO);
    }
    return cafeLocationList;
}
const getFilteredCafeLocationList = async (tags) => {
    const tag_ids = await Tag.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    let tagList: mongoose.Types.ObjectId[]= []
    for (let tag of tag_ids){
        tagList.push(tag._id);
    } 
    const cafes = await Cafe.find().where('tags').all(tagList).select("_id latitude longitude");

    let cafeLocationList: ICafeLocationDTO[] = []

    for (let cafe of cafes){
        let location: ICafeLocationDTO = {
            _id: cafe._id,
            latitude: cafe.latitude,
            longitude: cafe.longitude
        }
        cafeLocationList.push(location)
    }
    return cafeLocationList;
}

module.exports = {
    getCafeLocationList,
    getFilteredCafeLocationList
}
   
