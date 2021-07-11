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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const NAVERMAPURL = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
const requestGeocoding = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const coord = yield axios_1.default.get(NAVERMAPURL, {
        params: {
            query: address
        },
        headers: {
            "X-NCP-APIGW-API-KEY-ID": config_1.default.mapClientId,
            "X-NCP-APIGW-API-KEY": config_1.default.mapSecretKey
        }
    });
    if (!coord.data.addresses)
        return null;
    if (coord.data.addresses.length != 1) {
        console.log(address, "좌표값이 두 개 이상입니다.");
    }
    return coord.data.addresses[0];
});
module.exports = {
    requestGeocoding
};
//# sourceMappingURL=geocoderService.js.map