import { Router } from 'express';
import { GenshinKit, util } from 'genshin-kit';
import { char_en } from '../utils/character_en';
import { region_en } from '../utils/region_en';

const router = Router();
const App = new GenshinKit();
App.setServerType('os');
App.loginWithCookie(process.env.COOKIE as string);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/', async (req, res: any) => {
    const uid = req.query.id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await res.locals.get(`${uid}`, async (err: any, data: any) => {
        if (err) throw err;
        if (data) {
            const cachedb = JSON.parse(data);
            res.json(cachedb);
        } else {
            try {
                const validId = util.isValidOsUid(Number(uid));
                if (validId == false) {
                    return res.json({
                        message: 'Invalid uid'
                    });
                }
                const player = await App.getUserInfo(Number(uid));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const characters: any = [];
                player.avatars.forEach((char) => {
                    const newChar = {
                        image: char.image,
                        name: char_en(String(char.name)),
                        element: char.element,
                        level: char.level,
                        rarity: char.rarity,
                        constellation: char.actived_constellation_num
                    };
                    characters.push(newChar);
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const explorations: any = [];
                player.world_explorations.forEach((region) => {
                    const newRegion = {
                        level: region.level,
                        explored: region.exploration_percentage,
                        icon: region.icon,
                        name: region_en(region.name),
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
                        total_chests:
                            player.stats.precious_chest_number +
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
                await res.locals.setex(`${uid}`, 1800, JSON.stringify(db));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err) {
                res.json({
                    message: 'An error occured'
                });
            }
        }
    });
});

export default router;
