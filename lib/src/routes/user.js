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
const express_1 = require("express");
const genshin_kit_1 = require("genshin-kit");
const character_en_1 = require("../utils/character_en");
const region_en_1 = require("../utils/region_en");
const emotes_json_1 = __importDefault(require("../../assets/emotes.json"));
const router = express_1.Router();
const App = new genshin_kit_1.GenshinKit();
App.setServerType('os');
App.loginWithCookie(process.env.COOKIE);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.query.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yield res.locals.get(`${uid}:test`, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        if (data) {
            const cachedb = JSON.parse(data);
            res.json(cachedb);
        }
        else {
            try {
                const validId = genshin_kit_1.util.isValidOsUid(Number(uid));
                if (validId == false) {
                    return res.json({
                        message: 'error',
                        error: 'Invalid uid was provided'
                    });
                }
                const player = yield App.getUserInfo(Number(uid));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const characters = [];
                player.avatars.forEach((char) => {
                    const newChar = {
                        image: char.image,
                        name: character_en_1.char_en(String(char.name)),
                        element: char.element,
                        level: char.level,
                        rarity: char.rarity,
                        constellation: char.actived_constellation_num,
                        emote: ''
                    };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    newChar.emote = emotes_json_1.default[newChar.name];
                    characters.push(newChar);
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const explorations = [];
                player.world_explorations.forEach((region) => {
                    const newRegion = {
                        level: region.level,
                        explored: region.exploration_percentage,
                        icon: region.icon,
                        name: region_en_1.region_en(region.name),
                        type: region.type
                    };
                    explorations.push(newRegion);
                });
                const db = {
                    stats: {
                        active_days: player.stats.active_day_number,
                        achievements: player.stats.achievement_number,
                        anemoculi: player.stats.anemoculus_number,
                        geoculi: player.stats.geoculus_number,
                        total_chests: player.stats.precious_chest_number +
                            player.stats.luxurious_chest_number +
                            player.stats.exquisite_chest_number +
                            player.stats.common_chest_number,
                        unlocked_domains: player.stats.domain_number,
                        spiral_abyss: player.stats.spiral_abyss
                    },
                    characters: characters,
                    explorations: explorations
                };
                res.json(db);
                yield res.locals.setex(`${uid}:test`, 1800, JSON.stringify(db));
            }
            catch (err) {
                res.json({
                    message: 'error',
                    error: err
                });
            }
        }
    }));
}));
exports.default = router;
