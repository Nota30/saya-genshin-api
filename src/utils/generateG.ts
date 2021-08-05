/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCanvas, loadImage } from 'canvas';

const banners = {
    Cryo: 'https://i.imgur.com/HyR9hAf.png',
    Hydro: 'https://i.imgur.com/nLQYmxv.png',
    Geo: 'https://i.imgur.com/2jl55t6.png',
    Electro: 'https://i.imgur.com/ySdnP9U.png',
    Anemo: 'https://i.imgur.com/YCVH9Em.png',
    Dendro: 'https://i.imgur.com/nfCGKIW.png',
    Pyro: 'https://i.imgur.com/sFH6LJq.png'
};
const cards = {
    Cryo: 'https://i.imgur.com/2hn8AB9.png',
    Hydro: 'https://i.imgur.com/8ZZRjIh.png',
    Geo: 'https://i.imgur.com/Z9EChMd.png',
    Electro: 'https://i.imgur.com/AMss2ar.png',
    Anemo: 'https://i.imgur.com/MDdrAwZ.png',
    Dendro: 'https://i.imgur.com/UmBD60p.png',
    Pyro: 'https://i.imgur.com/dhu2TRh.png'
};
const colors = {
    Cryo: '#00eaff',
    Hydro: '#148aff',
    Geo: '#c77e10',
    Electro: '#a600ff',
    Anemo: '#00fc97',
    Dendro: '#009617',
    Pyro: '#eb5e34'
};
const rarity = {
    4: 'https://i.imgur.com/4bktpf3.png',
    5: 'https://i.imgur.com/6mbb7RB.png'
};

export const generated = async (data: {
    stats: {
        active_days: number;
        achievements: number;
        anemoculi: number;
        geoculi: number;
        total_chests: number;
        unlocked_domains: number;
        spiral_abyss: string;
    };
    characters: Array<{
        image: string;
        name: string;
        element: string;
        level: number;
        rarity: number;
        constellation: number;
        emote: string;
    }>;
    explorations: Array<{
        level: number;
        explored: number;
        icon: string;
        name: string;
        type: string;
    }>;
    message: string;
}): Promise<Record<string, unknown>> => {
    const characters = data.characters.slice(0, 5);
    const explorations = data.explorations.slice(0, 3);
    const canvas: any = createCanvas(960, 500);
    const banner = await loadImage(banners[characters[0].element || 'Geo']);
    const main = await loadImage('https://i.imgur.com/WGMNQBh.png');
    const profile = await loadImage('https://i.imgur.com/VqoBYIK.png');
    const explorationBanner = await loadImage('https://i.imgur.com/sHhTfpd.png');
    const profileCharacter = await loadImage(characters[0].image);
    const profileBanner = await loadImage(cards[characters[0].element]);
    const profileColor = colors[characters[0].element];

    const ctx = canvas.getContext('2d');
    ctx.constructor.prototype.fillRoundedRect = function (
        x: any,
        y: any,
        w: any,
        h: any,
        rad: number,
        fill: any,
        stroke: any
    ) {
        if (typeof rad == 'undefined') rad = 5;
        this.beginPath();
        this.moveTo(x + rad, y);
        this.arcTo(x + w, y, x + w, y + h, rad);
        this.arcTo(x + w, y + h, x, y + h, rad);
        this.arcTo(x, y + h, x, y, rad);
        this.arcTo(x, y, x + w, y, rad);
        if (stroke) this.stroke();
        if (fill || typeof fill == 'undefined') this.fill();
    };

    ctx.drawImage(main, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(banner, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(profile, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(98, 79, 56.5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profileBanner, 27, 10, 150, (150 * profileCharacter.height) / profileCharacter.width);
    ctx.drawImage(profileCharacter, 43, 25, 111, (111 * profileCharacter.height) / profileCharacter.width);
    ctx.arc(98, 79, 54, 0, Math.PI * 2, true);
    ctx.lineWidth = 3;
    ctx.strokeStyle = profileColor;
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = '17px intro';
    ctx.fillText(`${data.stats.total_chests}`, 185, 258);
    ctx.fillText(`${data.stats.achievements}`, 185, 310);
    ctx.fillText(`${data.stats.anemoculi}`, 185, 361);
    ctx.fillText(`${data.stats.geoculi}`, 185, 411);
    ctx.fillText(`${data.stats.spiral_abyss}`, 185, 462);

    characters.map(async (element) => {
        const card = await loadImage(cards[element.element || 'Anemo']);
        const img = await loadImage(element.image);
        const stars = await loadImage(rarity[element.rarity || 4]);

        ctx.drawImage(card, 225 + characters.indexOf(element) * 140, 15, card.width, card.height);
        ctx.drawImage(img, 240 + characters.indexOf(element) * 140, 37, 119, (119 * img.height) / img.width);
        ctx.drawImage(stars, 225 + characters.indexOf(element) * 140, 15, stars.width, stars.height);
        ctx.textAlign = 'start';
        ctx.font = '17px century';
        ctx.fillStyle = '#4a4740';
        ctx.fillText(`Lvl. ${element.level || 0}`, 272 + characters.indexOf(element) * 140, 180);
    });

    explorations.map(async (element) => {
        const icon = await loadImage(element.icon);
        ctx.drawImage(
            explorationBanner,
            225 + explorations.indexOf(element) * 247,
            216,
            explorationBanner.width,
            explorationBanner.height
        );
        ctx.drawImage(icon, 268 + explorations.indexOf(element) * 247, 223, 121, 121);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRoundedRect(250 + explorations.indexOf(element) * 247, 421, 157, 16, 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRoundedRect(250 + explorations.indexOf(element) * 247, 421, (157 / 100) * element.explored, 16, 8);
        ctx.textAlign = 'center';
        ctx.font = '20px intro';
        ctx.fillText(`${element.name}`, 330 + explorations.indexOf(element) * 247, 410);
        ctx.fillText(`${element.type}`, 330 + explorations.indexOf(element) * 247, 460);
        ctx.font = '16px intro';
        ctx.fillStyle = '#4a4740';
        ctx.fillText(`${element.explored}%`, 330 + explorations.indexOf(element) * 247, 435);
    });
    return canvas.toBuffer();
};
