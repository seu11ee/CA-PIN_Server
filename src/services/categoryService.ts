import mongoose from "mongoose";
import { ICafeCategoryDTO } from "../interfaces/ICafe";
import Category from "../models/Category";
import CategoryColor from "../models/CategoryColor";
import User from "../models/User";
import Cafe from "../models/Cafe";
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

const createCategory = async(userId, colorIdx, categoryName, isDefault) => {
    const hexacode = await CategoryColor.findOne({color_id: colorIdx},{_id:false}).select("color_code");
    const user = await User.findOne({_id: userId}).select("_id");
    const cafeList: mongoose.Types.ObjectId[]= [] 
    
    if (!user) {
        throw createError(statusCode.NOT_FOUND,responseMessage.READ_USER_FAIL);
    } else if (!hexacode) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
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
        throw createError(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE);
    } else if (category == null) {
        // id가 일치하는 카테고리가 없는 경우
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }

    const cafeList: mongoose.Types.ObjectId[]= []
    for (let id of cafeIds) {
        const cafe = await Cafe.findOne({_id: id});
        if (cafe == null) {
            // id가 일치하는 카페가 없는 경우
            throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
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
    if (!category) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    } else if (category.isDefault) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.DELETE_DEFAULT_FAIL);
    }

    await Category.remove({_id: category._id}, function(err) {
        if (err) {
            throw err;
        }
    });
}

const fetchMyCategory = async(userId) => {
    const categoryList = await Category.find({user: userId}).select("_id cafes color name");
    if (!categoryList) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }
    return categoryList
}

const fetchCafesInCategory = async(categoryId, userId) => {
    const whatCategory = await Category.findOne({_id: categoryId, user: userId}).select("cafes")
    if (!whatCategory) {
        throw createError(statusCode.NOT_FOUND,responseMessage.INVALID_IDENTIFIER);
    }
    const cafes: ICafeCategoryDTO[] = []
    for (let cafe of whatCategory.cafes) {
        cafes.push(await Cafe.findOne({_id: cafe}).select("_id name tags address rating"));
    }

    return cafes
}

const checkCafeInCategory = async(cafeId,userId) => {
    const category = await Category.findOne({cafe: cafeId, user: userId})
    if (category) return true
    return false
}

module.exports = {
    createCategory,
    addCafe,
    deleteCategory,
    fetchMyCategory,
    fetchCafesInCategory,
    checkCafeInCategory
}