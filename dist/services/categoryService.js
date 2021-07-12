"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../models/Category"));
const CategoryColor_1 = __importDefault(require("../models/CategoryColor"));
const User_1 = __importDefault(require("../models/User"));
const Cafe_1 = __importDefault(require("../models/Cafe"));
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const createCategory = (userId, colorIdx, categoryName, isDefault) => __awaiter(void 0, void 0, void 0, function* () {
    const hexacode = yield CategoryColor_1.default.findOne({ color_id: colorIdx }, { _id: false }).select("color_code");
    const user = yield User_1.default.findOne({ _id: userId }).select("_id");
    const cafeList = [];
    if (!user) {
        throw createError(statusCode.NOT_FOUND, responseMessage.READ_USER_FAIL);
    }
    else if (!hexacode) {
        throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }
    const category = new Category_1.default({
        cafes: cafeList,
        user: userId,
        color: hexacode.color_code,
        name: categoryName,
        isDefault: isDefault
    });
    yield category.save();
    return category;
});
const editCategoryInfo = (categoryId, color, name) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findOne({ _id: categoryId });
    const hexacode = yield CategoryColor_1.default.findOne({ color_id: color });
    if (!category || !hexacode) {
        throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }
    else if (category.isDefault) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.EDIT_DEFAULT_FAIL);
    }
    yield Category_1.default.findOneAndUpdate({
        _id: categoryId
    }, {
        color: hexacode.color_code,
        name: name
    }, {
        new: true,
        useFindAndModify: false
    });
});
const deleteCafesinCategory = (categoryId, cafeList) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findOne({ _id: categoryId });
    // 찾으려는 카테고리가 없거나 카테고리 내에 삭제하려는 카페가 존재하지 않는 경우
    if (!category || ((cafeList.length != cafeList.filter(x => category.cafes.includes(x)).length))) {
        throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }
    for (let cafe of cafeList) {
        if (cafe in category.cafes) {
            throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
        }
        yield Category_1.default.findOneAndUpdate({
            _id: categoryId
        }, {
            $pull: { cafes: cafe }
        }, {
            useFindAndModify: false
        });
    }
});
const addCafe = (cafeIds, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findOne({ _id: categoryId });
    if (!category) {
        // id가 일치하는 카테고리가 없는 경우
        throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }
    const cafeList = [];
    for (let id of cafeIds) {
        const cafe = yield Cafe_1.default.findOne({ _id: id });
        if (cafe == null) {
            // id가 일치하는 카페가 없는 경우
            throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
        }
        cafeList.push(cafe._id);
    }
    yield Category_1.default.updateOne({
        _id: category._id
    }, {
        $addToSet: { cafes: cafeList }
    });
});
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findOne({ _id: categoryId });
    if (!category) {
        throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }
    else if (category.isDefault) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.DELETE_DEFAULT_FAIL);
    }
    yield Category_1.default.remove({ _id: category._id }, function (err) {
        if (err) {
            throw err;
        }
    });
});
const fetchMyCategory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryList = yield Category_1.default.find({ user: userId }).select("_id cafes color name");
    if (!categoryList) {
        throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }
    return categoryList;
});
const fetchCafesInCategory = (categoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const whatCategory = yield Category_1.default.findOne({ _id: categoryId, user: userId }).select("cafes");
    if (!whatCategory) {
        throw createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER);
    }
    const cafes = [];
    for (let cafe of whatCategory.cafes) {
        cafes.push(yield Cafe_1.default.findById(cafe).populate('tags', 'name').select("tags _id name address rating"));
    }
    return cafes;
});
const checkCafeInCategory = (cafeId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findOne({ cafe: cafeId, user: userId });
    if (category)
        return true;
    return false;
});
module.exports = {
    createCategory,
    editCategoryInfo,
    addCafe,
    deleteCafesinCategory,
    deleteCategory,
    fetchMyCategory,
    fetchCafesInCategory,
    checkCafeInCategory
};
//# sourceMappingURL=categoryService.js.map