import Cafe from "../models/Cafe";
import createError from "http-errors";
import { ICafeLocationDTO } from "../interfaces/ICafe";
import { IMyCafeCategoryDTO } from "../interfaces/ICategory";
import mongoose from "mongoose";
import Tag from "../models/Tag";
import Category from "../models/Category";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");

const getCafeLocationList = async (tags) => {
    const tag_ids = await Tag.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length){
        throw createError(statusCode.BAD_REQUEST,responseMessage.INVALID_IDENTIFIER);
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
        return null;
    }
    return cafeLocationList;
}

const getMyMapCafeList = async(userId) => {
    const mycafeList = await Category.find({user: userId}).populate('cafes','longitude latitude').select("cafes color name");
    if (!mycafeList) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }
    let cafeList: IMyCafeCategoryDTO[] = []
    for (let item of mycafeList) {
        // 카테고리에 카페가 1개 이상 있을 때만 push
        if (item.cafes.length > 0) {
            let info: IMyCafeCategoryDTO = {
                cafes: item.cafes,
                color: item.color,
                name: item.name
            }
            cafeList.push(info);
        }
    }
    console.log(cafeList);
    return cafeList
}

const getCafeDetail = async(cafeId) => {
    const detail = await Cafe.findById(cafeId).populate('tags');

    if (!detail){
        return null;
    }
    return detail;

}

const getNoCoordCafes = async() => {
    const cafes = await Cafe.find().or([{latitude: {$exists : false}},{longitude: {$exists : false}}]);
    if (cafes.length == 0) return null;
    return cafes;
}

const saveCoord = async(cafe) => {
    await cafe.save();
    return;
}

const isCafeExists = async(cafeId) => {
    const cafe = await Cafe.findById(cafeId)
    if (!cafe) return false
    return true
}
module.exports = {
    getCafeLocationList,
    getMyMapCafeList,
    getCafeDetail,
    getNoCoordCafes,
    saveCoord,
    isCafeExists
}
   
