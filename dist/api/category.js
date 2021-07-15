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
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const categoryService = require("../services/categoryService");
/**
 *  @route Post category/
 *  @desc generate category(카테고리 생성)
 *  @access Private
 */
router.post("/", [
    express_validator_1.check("colorIdx", "color_id is required").not().isEmpty(),
    express_validator_1.check("categoryName", "color_name is required").not().isEmpty(),
], auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    const { colorIdx, categoryName } = req.body;
    try {
        yield categoryService.createCategory(userId, colorIdx, categoryName, false);
        return res.status(statusCode.CREATED).json({
            message: responseMessage.CREATE_CATEGORY_SUCCESS
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Put category/:categoryId/
 *  @desc edit category info(카테고리 정보 수정)
 *  @access Private
 */
router.put("/:categoryId/", [
    express_validator_1.check("colorIdx", "color_id is required").not().isEmpty(),
    express_validator_1.check("categoryName", "color_name is required").not().isEmpty(),
], auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    const categoryId = req.params.categoryId;
    const { colorIdx, categoryName } = req.body;
    try {
        yield categoryService.editCategoryInfo(categoryId, colorIdx, categoryName);
        return res.status(statusCode.OK).json({
            message: responseMessage.EDIT_CATEGORY_SUCCESS
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Post /category/:cafeId/archive
 *  @desc pin,unpin cafes in category(카테고리에 카페 넣기,빼기,변경하기)
 *  @access Private
 */
router.post("/:cafeId/archive", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const cafeId = req.params.cafeId;
    const { categoryId } = req.body;
    try {
        if (!mongoose_1.default.isValidObjectId(cafeId)) {
            return next(createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER));
        }
        yield categoryService.storeCafe(userId, categoryId, cafeId);
        return res.status(statusCode.OK).json({
            message: responseMessage.ADD_PIN_SUCCESS
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Delete /category/:categoryId/archive
 *  @desc delete cafes in category(카테고리에 있는 카페 삭제)
 *  @access Private
 */
router.delete("/:categoryId/archive", [
    express_validator_1.check("cafeList", "cafeList is required").not().isEmpty(),
], auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(createError(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    const categoryId = req.params.categoryId;
    const { cafeList } = req.body;
    try {
        if (!mongoose_1.default.isValidObjectId(categoryId)) {
            return next(createError(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER));
        }
        yield categoryService.deleteCafesinCategory(categoryId, cafeList);
        return res.status(statusCode.OK).json({
            message: responseMessage.DELETE_CAFES_IN_CATEGORY_SUCCESS
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Delete category/:categoryId
 *  @desc delete category(카테고리 삭제)
 *  @access Private
 */
router.delete("/:categoryId", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    try {
        if (!mongoose_1.default.isValidObjectId(categoryId)) {
            return next(createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER));
        }
        yield categoryService.deleteCategory(categoryId);
        return res.status(statusCode.OK).json({
            message: responseMessage.DELETE_CATEGORY_SUCCESS
        });
    }
    catch (error) {
        return next(error);
    }
}));
/**
 *  @route Get category/:categoryId/cafes
 *  @desc fetch cafes in category(카테고리에 핀된 카페들 모아보기)
 *  @access Private
 */
router.get("/:categoryId/cafes", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    try {
        if (!mongoose_1.default.isValidObjectId(categoryId)) {
            return next(createError(statusCode.NOT_FOUND, responseMessage.INVALID_IDENTIFIER));
        }
        const cafeList = yield categoryService.fetchCafesInCategory(categoryId, res.locals.userId);
        return res.status(statusCode.OK).json({
            message: responseMessage.READ_CATEGORY_CAFE_SUCCESS,
            cafeDetail: cafeList
        });
    }
    catch (error) {
        return next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=category.js.map