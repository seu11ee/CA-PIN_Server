import axios from "axios";
import createError from "http-errors";
import mongoose from "mongoose";
import { nextTick } from "process";
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");

const requestGeocoding = async (address) => {
    const coord = await axios.get("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode",
                {
                    params: {
                        query: address
                    },
                    headers:{
                        "X-NCP-APIGW-API-KEY-ID": "l0davkpwub",
                        "X-NCP-APIGW-API-KEY": "20yKo7pyAkyK7LP4p4uVh2SEMZw83ZVlNnaaDhhU"
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