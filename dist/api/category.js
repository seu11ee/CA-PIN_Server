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
const categoryService = require("../services/categoryService");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
/**
 *  @route Post api/category
 *  @desc generate category(카테고리 생성)
 *  @access Private
 */
router.post("/", [
    express_validator_1.check("colorIdx", "color_id is required").not().isEmpty(),
    express_validator_1.check("categoryName", "color_name is required").not().isEmpty(),
], auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { colorIdx, categoryName } = req.body;
    try {
        console.log(res.locals.tokenValue);
        console.log(res.locals.userId);
        const category = yield categoryService.createCategory(res.locals.userId, colorIdx, categoryName, false);
        res.status(statusCode.CREATED).json({
            message: responseMessage.CREATE_CATEGORY_SUCCESS
        });
        next();
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.OUT_OF_VALUE:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}));
/**
 *  @route Post api/category/pin
 *  @desc generate category(카테고리에 카페 추가)
 *  @access Private
 */
router.post("/pin", [
    express_validator_1.check("cafeIds", "cafe_ids is required").not().isEmpty(),
    express_validator_1.check("categoryId", "category_id is required").not().isEmpty(),
], auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { cafeIds, categoryId } = req.body;
    try {
        console.log(res.locals.tokenValue);
        console.log(res.locals.userId);
        yield categoryService.addCafe(cafeIds, categoryId);
        res.status(statusCode.OK).json({
            message: responseMessage.ADD_PIN_SUCCESS
        });
        next();
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.BAD_REQUEST:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            case responseMessage.INVALID_IDENTIFIER:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}));
/**
 *  @route Delete api/category/
 *  @desc generate category(카테고리에 카페 추가)
 *  @access Private
 */
router.delete("/:categoryId", [
    express_validator_1.check("categoryId", "categoryId is required").not().isEmpty(),
], auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    try {
        if (!mongoose_1.default.isValidObjectId(categoryId)) {
            throw (Error(responseMessage.INVALID_IDENTIFIER));
        }
        else {
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            yield categoryService.deleteCategory(categoryId);
            res.status(statusCode.OK).json({
                message: responseMessage.DELETE_CATEGORY_SUCCESS
            });
            next();
        }
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.DELETE_DEFAULT_FAIL:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            case responseMessage.INVALID_IDENTIFIER:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}));
/**
 *  @route Get api/category/
 *  @desc fetch cafes in category(카테고리에 핀된 카페들 모아보기)
 *  @access Private
 */
router.get("/:categoryId/cafes", auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    try {
        if (!mongoose_1.default.isValidObjectId(categoryId)) {
            throw (Error(responseMessage.INVALID_IDENTIFIER));
        }
        else {
            console.log(res.locals.tokenValue);
            console.log(res.locals.userId);
            const cafeList = yield categoryService.fetchCafesInCategory(categoryId, res.locals.userId);
            res.status(statusCode.OK).json({
                message: responseMessage.READ_CATEGORY_CAFE_SUCCESS,
                cafeDetail: cafeList
            });
            next();
        }
    }
    catch (error) {
        switch (error.message) {
            case responseMessage.INVALID_IDENTIFIER:
                res.status(statusCode.BAD_REQUEST).send({ message: error.message });
                break;
            default:
                res.status(statusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}));
module.exports = router;
//# sourceMappingURL=category.js.map