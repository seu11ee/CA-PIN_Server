import mongoose from "mongoose";
import config from "../config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
const categoryService = require("../services/categoryService");
// import { IUser, IUserOutputDTO } from "../interfaces/IUser";
const responseMessage = require("../modules/responseMessage");

const loginUser = async(email, password) => {
    let user = await User.findOne({ email });

    // 없는 유저
    if (!user) {
        throw Error(responseMessage.NO_EMAIL);
    }

    // 비밀번호 불일치
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw Error(responseMessage.MISS_MATCH_PW);
    }
    
    return user
};

const generateToken = async(user_id) => {
    // Return jsonwebtoken
    const token = jwt.sign(
        { sub: user_id }, 
        config.jwtSecret, 
        { expiresIn: 86400 });

    // console.log(token)
    return token
};

const signupUser = async (nickname, email, password) => {
    // email, password, nickname으로 유저 생성
    // 이메일 중복 확인
    const alreadyEmail = await User.findOne({ email });
    console.log(alreadyEmail);
    // 닉네임 중복 확인
    const alreadyNickname = await User.findOne({nickname});
    console.log(alreadyNickname);

    if (alreadyEmail != null) {
        throw Error(responseMessage.ALREADY_EMAIL);
    } else if (alreadyNickname != null) {
        throw Error(responseMessage.ALREADY_NICKNAME);
    }

    let created_at = Date.now();
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

module.exports = {
    loginUser,
    signupUser,
    generateToken
}