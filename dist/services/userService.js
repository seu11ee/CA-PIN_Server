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
const config_1 = __importDefault(require("../config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const categoryService = require("../services/categoryService");
const responseMessage = require("../modules/responseMessage");
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User_1.default.findOne({ email });
    // 없는 유저
    if (!user) {
        throw Error(responseMessage.NO_EMAIL);
    }
    // 비밀번호 불일치
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw Error(responseMessage.MISS_MATCH_PW);
    }
    return user;
});
const generateToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Return jsonwebtoken
    const token = jsonwebtoken_1.default.sign({ sub: userId }, config_1.default.jwtSecret, { expiresIn: 86400 });
    // console.log(token)
    return token;
});
const signupUser = (nickname, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // email, password, nickname으로 유저 생성
    // 이메일 중복 확인
    const alreadyEmail = yield User_1.default.findOne({ email });
    // 닉네임 중복 확인
    const alreadyNickname = yield User_1.default.findOne({ nickname });
    if (alreadyEmail != null) {
        throw Error(responseMessage.ALREADY_EMAIL);
    }
    else if (alreadyNickname != null) {
        throw Error(responseMessage.ALREADY_NICKNAME);
    }
    let created_at = Date.now();
    const user = new User_1.default({
        email,
        password,
        nickname,
        created_at
    });
    // Encrypt password
    const salt = yield bcryptjs_1.default.genSalt(10);
    user.password = yield bcryptjs_1.default.hash(password, salt);
    yield user.save();
    // 기본 카테고리 생성
    const newbi = yield User_1.default.findOne({ email });
    categoryService.createCategory(newbi._id, 0, "기본 카테고리", true);
    return user;
});
module.exports = {
    loginUser,
    signupUser,
    generateToken
};
//# sourceMappingURL=userService.js.map