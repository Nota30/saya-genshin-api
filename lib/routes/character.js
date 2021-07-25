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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = require("fs");
const router = express_1.Router();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const character = req.query.character;
        //const file = readFileSync(`/root/saya-genshin/assets/characters/${character}.json`, 'utf8');
        const file = fs_1.readFileSync(`C/Users/haren/Desktop/saya-genshin/assets/characters/${character}.json`, 'utf8');
        const data = JSON.parse(file);
        data.message = 'success';
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.json({
            message: 'An error occured',
            error: err
        });
    }
}));
exports.default = router;