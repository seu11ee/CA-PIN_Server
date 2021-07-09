import config from "../config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Review from "../models/Review";
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const categoryService = require("../services/categoryService");
const responseMessage = require("../modules/responseMessage");
const nd = require("../modules/dateCalculate");

const loginUser = async(email, password) => {
    let user = await User.findOne({ email });

    // 없는 유저
    if (!user) {
        throw createError(statusCode.NOT_FOUND,responseMessage.NO_EMAIL);
    }

    // 비밀번호 불일치
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.MISS_MATCH_PW);
    }
    
    return user
};

const generateToken = async(userId) => {
    // Return jsonwebtoken
    const token = jwt.sign(
        { sub: userId }, 
        config.jwtSecret, 
        { expiresIn: 86400 });

    // console.log(token)
    return token
};

const signupUser = async (nickname, email, password) => {
    // email, password, nickname으로 유저 생성
    // 이메일 중복 확인
    const alreadyEmail = await User.findOne({ email });
    // 닉네임 중복 확인
    const alreadyNickname = await User.findOne({nickname});

    if (alreadyEmail != null) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.ALREADY_EMAIL);
    } else if (alreadyNickname != null) {
        throw createError(statusCode.BAD_REQUEST,responseMessage.ALREADY_NICKNAME);
    }

    let created_at = nd.getDate();
    const user = new User({
        email,
        password,
        nickname,
        created_at
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    // 기본 카테고리 생성
    const newbi = await User.findOne({ email });
    categoryService.createCategory(newbi._id, 0, "기본 카테고리", true);
    return user;
}

const fetchUserInfo = async(userId) => {
    // userInfo
    const user = await User.findOne({_id: userId}).select("_id nickname email cafeti profileImg");
    if (!user) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.READ_USER_FAIL);
    }

    // User's Review number
    const reviews = await (await Review.find({_id: userId})).length;

    // User's Pin number
    const categories = await categoryService.fetchMyCategory(userId);
    let pins: number = 0;
    for (let category of categories) {
        pins += category.cafes.length;
    }

    return {user, reviews, pins};
}

module.exports = {
    loginUser,
    signupUser,
    generateToken,
    fetchUserInfo
}