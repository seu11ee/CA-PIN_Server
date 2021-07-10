import axios from "axios";
import createError from "http-errors";
import mongoose from "mongoose";
import { nextTick } from "process";
import config from "../config";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const NAVERMAPURL = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
const requestGeocoding = async (address) => {
    const coord = await axios.get(NAVERMAPURL,
                {
                    params: {
                        query: address
                    },
                    headers:{
                        "X-NCP-APIGW-API-KEY-ID": config.mapClientId,
                        "X-NCP-APIGW-API-KEY": config.mapSecretKey
                    }
                });
    if (!coord.data.addresses) return null;
    if (coord.data.addresses.length != 1){
        console.log(address,"좌표값이 두 개 이상입니다.");
    }
    return coord.data.addresses[0]

}

module.exports = {
    requestGeocoding
}