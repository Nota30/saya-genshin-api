import { Router } from 'express';
import { readFileSync } from 'fs';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/', async (req, res: any) => {
    try {
        const character = req.query.character;
        //const file = readFileSync(`/root/saya-genshin/assets/characters/${character}.json`, 'utf8');
        const file = readFileSync(`C:/Users/haren/Desktop/saya-genshin/assets/characters/${character}.json`, 'utf8');
        const data = JSON.parse(file);
        data.message = 'success';
        res.json(data);
    } catch (err) {
        res.json({
            message: 'error',
            error: err
        });
    }
});

export default router;
