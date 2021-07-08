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
const Cafe_1 = __importDefault(require("../models/Cafe"));
const Tag_1 = __importDefault(require("../models/Tag"));
const responseMessage = require("../modules/responseMessage");
const getCafeLocationList = (tags) => __awaiter(void 0, void 0, void 0, function* () {
    const tag_ids = yield Tag_1.default.find({
        'tagIdx': { $in: tags
        }
    }).select('_id');
    if (tags.length != tag_ids.length) {
        throw Error(responseMessage.INVALID_IDENTIFIER);
    }
    let tagList = [];
    for (let tag of tag_ids) {
        tagList.push(tag._id);
    }
    var cafes;
    //쿼리에 태그 정보가 없으면 전체 카페 리스트 조회
    if (tagList.length != 0) {
        cafes = yield Cafe_1.default.find().where('tags').all(tagList).select("_id latitude longitude");
    }
    //태그로 필터된 카페 리스트 조회
    else {
        cafes = yield Cafe_1.default.find().select("_id latitude longitude");
    }
    let cafeLocationList = [];
    for (let cafe of cafes) {
        let location = {
            _id: cafe._id,
            latitude: cafe.latitude,
            longitude: cafe.longitude
        };
        cafeLocationList.push(location);
    }
    if (cafeLocationList.length == 0) {
        throw Error(responseMessage.NO_CONTENT);
    }
    return cafeLocationList;
});
const getCafeDetail = (cafeId) => __awaiter(void 0, void 0, void 0, function* () {
    const detail = yield Cafe_1.default.findById(cafeId).populate('tags');
    if (!detail) {
        throw Error(responseMessage.NO_CONTENT);
    }
    return detail;
});
module.exports = {
    getCafeLocationList,
    getCafeDetail
};
//# sourceMappingURL=cafeService.js.map