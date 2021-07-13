"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MenuSchema = new mongoose_1.default.Schema({
    cafe: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Cafe",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    collection: "menus",
    versionKey: false
});
exports.default = mongoose_1.default.model("Menu", MenuSchema);
//# sourceMappingURL=Menu.js.map