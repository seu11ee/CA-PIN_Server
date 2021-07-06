import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import config from "../config";
import User from "../models/User";
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

const signupUser = async (nickname, email, password) => {
    // email, password, nickname으로 유저 생성
    // 이메일 중복 확인
    const alreadyEmail = await User.findOne({ email });
    console.log(alreadyEmail);
    // 닉네임 중복 확인
    const alreadyNickname = await User.findOne({nickname});
    console.log(alreadyNickname);

    if (alreadyEmail != null && alreadyNickname != null) {
        throw Error(responseMessage.ALREADY_EMAIL);
    } else if (alreadyNickname != null) {
        throw Error(responseMessage.ALREADY_NICKNAME);
    }

    // let now = Date.now();
    const user = new User({
        email,
        password,
        nickname,
        // now
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    // const payload = {
    //     user: {
    //         id: userId.Objectid,
    //     }
    // };
    // jwt.sign(
    //     payload,
    //     config.jwtSecret,
    //     { expiresIn: 36000 },
    //     (err, token) => {
    //         if (err) throw err;
    //         responseMessage.json({token});
    //     }
    // );

    // 카테고리 1개 생성해줘야함
    // await createDefaultCategory(user.Objectid);
    return user;
}

const getUserById = async (id) => {
    const user = await User.findOne({id});
    if (user == null) {
        throw Error(responseMessage.READ_USER_FAIL)
    } else {
        return user;
    }
};

module.exports = {
    loginUser,
    signupUser
}