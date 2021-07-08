import mongoose from "mongoose";
import { ICafe } from "../interfaces/ICafe";
import Category from "../models/Category";
import CategoryColor from "../models/CategoryColor";
import User from "../models/User";
import Cafe from "../models/Cafe";
const responseMessage = require("../modules/responseMessage");

const createCategory = async(userId, colorIdx, categoryName, isDefault) => {
    const hexacode = await CategoryColor.findOne({color_id: colorIdx},{_id:false}).select("color_code");
    const user = await User.findOne({_id: userId}).select("_id");
    const cafeList: mongoose.Types.ObjectId[]= [] 
    console.log(hexacode.color_code);
    console.log(userId);
    
    if (user == null) {
        throw Error(responseMessage.READ_USER_FAIL);
    } else if (hexacode == null) {
        throw Error(responseMessage.OUT_OF_VALUE);
    }

    const category = new Category({
        cafes: cafeList,
        user: userId,
        color: hexacode.color_code,
        name: categoryName,
        isDefault: isDefault
    });

    await category.save();

    return category;
};

const addCafe = async(cafeIds, categoryId) => {
    const category = await Category.findOne({_id: categoryId});
 
    if (cafeIds.length == 0) {
        // 추가하려는 카페가 없이 넘어온 경우
        throw Error(responseMessage.BAD_REQUEST);
    } else if (category == null) {
        // id가 일치하는 카테고리가 없는 경우
        throw Error(responseMessage.INVALID_IDENTIFIER);
    }

    const cafeList: mongoose.Types.ObjectId[]= []
    for (let id of cafeIds) {
        const cafe = await Cafe.findOne({_id: id});
        if (cafe == null) {
            // id가 일치하는 카페가 없는 경우
            throw Error(responseMessage.INVALID_IDENTIFIER);
        }
        cafeList.push(cafe._id);
    }
    
    await Category.updateOne({
        _id: category._id
      },
      {
        $addToSet: {cafes: cafeList}
      });
};

const deleteCategory = async(categoryId) => {
    const category = await Category.findOne({_id: categoryId});
    if (category == null) {
        throw Error(responseMessage.INVALID_IDENTIFIER);
    } else if (category.isDefault) {
        throw Error(responseMessage.DELETE_DEFAULT_FAIL);
    }

    await Category.remove({_id: category._id}, function(err) {
        if (err) {
            throw err;
        }
    });
}

const fetchMyCategory = async(userId) => {
    const categoryList = await Category.find({user: userId}).select("_id cafes color name");
    if (categoryList == null) {
        throw Error(responseMessage.INVALID_IDENTIFIER);
    }
    return categoryList
}

module.exports = {
    createCategory,
    addCafe,
    deleteCategory,
    fetchMyCategory,
}