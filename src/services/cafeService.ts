import Cafe from "../models/Cafe";
import Tag from "../models/Tag";
import { ICafe, ICafeLocationDTO } from "../interfaces/ICafe";
import mongoose from "mongoose";
const responseMessage = require("../modules/responseMessage");

const getCafeLocationList = async (tags) => {
    const tag_ids = await Tag.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length){
        throw Error(responseMessage.INVALID_IDENTIFIER);
    }
    let tagList: mongoose.Types.ObjectId[]= []
    for (let tag of tag_ids){
        tagList.push(tag._id);
    }
    var cafes;
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    if (tagList.length != 0){
        cafes = await Cafe.find().where('tags').all(tagList).select("_id latitude longitude");
    }
    //태그로 필터된 카페 리스트 조회
    else{
        cafes = await Cafe.find().select("_id latitude longitude");
    }
    let cafeLocationList: ICafeLocationDTO[] = []

    for (let cafe of cafes){
        let location: ICafeLocationDTO = {
            _id: cafe._id,
            latitude: cafe.latitude,
            longitude: cafe.longitude
        }
        cafeLocationList.push(location)
    }
    if (cafeLocationList.length == 0){
        throw Error(responseMessage.NO_CONTENT);
    }
    return cafeLocationList;
}
const getCafeDetail = async(cafeId) => {
    const detail = await Cafe.findById(cafeId).populate('tags');

    if (!detail){
        throw Error(responseMessage.NO_CONTENT);
    }
    return detail;

}

module.exports = {
    getCafeLocationList,
    getCafeDetail
}
   
