"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CafeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    tags: {
        type: [mongoose_1.default.SchemaTypes.ObjectId],
        ref: "Tag",
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    instagram: {
        type: String
    },
    opentime: {
        type: String
    },
    opentimeHoliday: {
        type: String
    },
    closetime: {
        type: String
    },
    closetimeHoliday: {
        type: String
    },
    offday: {
        type: [Number]
    }
}, {
    collection: "cafes"
});
exports.default = mongoose_1.default.model("Cafe", CafeSchema);
//# sourceMappingURL=Cafe.js.map