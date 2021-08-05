const Command = require('../../Structures/Command');
const discord = require('discord.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const superagent = require('superagent');
const { MessageButton, MessageActionRow } = require('discord-buttons');
const Canvas = require('canvas');

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

class GenshinCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: 'Genshin-Impact',
            aliases: ['genshin'],
            userPerms: 'Custom',
            perms: ['EMBED_LINKS', 'MANAGE_MESSAGES'],
            category: 'Fun',
            description: 'Genshin Impact Module',
            usage: '{prefix}genshin <uid> [-p, -c]'
        });
    }

    async run(message, args) {
        if (!args[0]) {
            let embed = new MessageEmbed()
                .setTitle('Invalid Usage')
                .setDescription(
                    `${message.author} Please provide a \`user_id\` or a \`commnity_id\` or you can view characters | artifacts | weapons.\n> Examples: \n> s.genshin 700112838 -p \n> s.genshin characters klee`
                )
                .setColor('RED');
            return message.channel.send(`${message.author}`, embed);
        }
        if (args[0] == 'characters' || 'character') {
            let embed = new MessageEmbed()
                .setTitle('Ganyu')
                .setImage('https://static.wikia.nocookie.net/gensin-impact/images/8/8d/Character_Ganyu_Card.png')
                .setColor('BLUE');

            let embed2 = new MessageEmbed().setTitle('Ganyu').setDescription('Data goes here').setColor('BLUE');

            let button = new MessageButton().setLabel('Image').setStyle('blurple').setID('image');

            let button2 = new MessageButton().setLabel('Information').setStyle('blurple').setID('info');

            let buttonRow = new MessageActionRow().addComponent(button).addComponent(button2);

            let m = await message.channel.send({ embed: embed, component: buttonRow });

            const filter = async (button) => {
                if (button.clicker.user.id === message.author.id) {
                    if (button.id == 'info') {
                        await m.edit({ embed: embed2 });
                    }
                }
            };
            const collector = m.createButtonCollector(filter, { time: 10000 });

            collector.on('collect', async (b) => console.log('done'));
            collector.on('end', (collected) => console.log(`Collected ${collected.size} items`));
            return;
        }
        if (!args[1]) {
            let embed = new MessageEmbed()
                .setTitle('Invalid Usage')
                .setDescription(
                    `Please provide an argument!\n Arguments: [-p] profile, [-c] characters\n Example:\n> genshin <uid> -p\n> genshin <uid> -c\n> genshin 626744380 -p\n> genshin 626744380 -c`
                )
                .setColor('RED');
            return message.channel.send(`${message.author}`, embed);
        }
        if (args[1] == '-p') {
            const sent = await message.channel.send('**Loading profile...**');
            try {
                const { body } = await superagent.get(`http://genshin.saya.gg/user/?id=${args[0]}`);
            } catch (err) {
                let embed = new MessageEmbed()
                    .setTitle('Error')
                    .setColor('RED')
                    .setDescription(
                        `Invalid \`id\` or the users profile is not public.\n To make the profile public:\n> 1. Go to [hoyolabs](https://www.hoyolab.com/genshin/)\n> 2. Sign in\n> 3. Tap on Account info\n> 4. Toggle the bar to public.`
                    )
                    .setImage(
                        'https://cdn.discordapp.com/attachments/660507874086354945/847784123141849108/Untitled_1.png'
                    )
                    .setFooter(
                        'Note: Making your account public will not reveal any sensitive information. It will just make you game stats and other various functions public.'
                    );
                sent.delete();
                return message.channel.send(embed);
            }
            const { body } = await superagent.get(`http://genshin.saya.gg/user/?id=${args[0]}`);
            const data = body;
            const chests =
                (data.stats.common_chests || 0) +
                (data.stats.exquisite_chests || 0) +
                (data.stats.precious_chests || 0) +
                (data.stats.luxurious_chests || 0);
            const achievements = data.stats.achievements || 0;
            const geoculi = data.stats.geoculi || 0;
            const anemoculi = data.stats.anemoculi || 0;
            const spiral_abyss = data.stats.spiral_abyss || '0-0';
            const characters = data.characters.slice(0, 5);
            const explorations = data.explorations.slice(0, 3);
            const canvas = Canvas.createCanvas(960, 500);
            const banner = await Canvas.loadImage(banners[characters[0].element || 'Geo']);
            const main = await Canvas.loadImage('https://i.imgur.com/WGMNQBh.png');
            const profile = await Canvas.loadImage('https://i.imgur.com/VqoBYIK.png');
            const explorationBanner = await Canvas.loadImage('https://i.imgur.com/sHhTfpd.png');

            const profileCharacter = await Canvas.loadImage(characters[0].icon);
            const profileBanner = await Canvas.loadImage(cards[characters[0].element]);
            const profileColor = colors[characters[0].element];

            const ctx = canvas.getContext('2d');

            ctx.constructor.prototype.fillRoundedRect = function (x, y, w, h, rad, fill, stroke) {
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
            ctx.fillText(`${chests}`, 185, 258);
            ctx.fillText(`${achievements}`, 185, 310);
            ctx.fillText(`${anemoculi}`, 185, 361);
            ctx.fillText(`${geoculi}`, 185, 411);
            ctx.fillText(`${spiral_abyss}`, 185, 462);

            for (let character in characters) {
                const char = characters[character];
                const card = await Canvas.loadImage(cards[char.element || 'Anemo']);
                const img = await Canvas.loadImage(char.icon);
                const stars = await Canvas.loadImage(rarity[char.rarity || 4]);

                ctx.drawImage(card, 225 + character * 140, 15, card.width, card.height);
                ctx.drawImage(img, 240 + character * 140, 37, 119, (119 * img.height) / img.width);
                ctx.drawImage(stars, 225 + character * 140, 15, stars.width, stars.height);
                ctx.textAlign = 'start';
                ctx.font = '17px century';
                ctx.fillStyle = '#4a4740';
                ctx.fillText(`Lvl. ${char.level || 0}`, 272 + character * 140, 180);
            }

            for (let exploration in explorations) {
                const icon = await Canvas.loadImage(explorations[exploration].icon);
                ctx.drawImage(
                    explorationBanner,
                    225 + exploration * 247,
                    216,
                    explorationBanner.width,
                    explorationBanner.height
                );
                ctx.drawImage(icon, 268 + exploration * 247, 223, 121, 121);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRoundedRect(250 + exploration * 247, 421, 157, 16, 8);
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                ctx.fillRoundedRect(
                    250 + exploration * 247,
                    421,
                    (157 / 100) * explorations[exploration].explored,
                    16,
                    8
                );
                ctx.textAlign = 'center';
                ctx.font = '20px intro';
                ctx.fillText(`${explorations[exploration].name}`, 330 + exploration * 247, 410);
                ctx.fillText(`${explorations[exploration].type}`, 330 + exploration * 247, 460);
                ctx.font = '16px intro';
                ctx.fillStyle = '#4a4740';
                ctx.fillText(`${explorations[exploration].explored}%`, 330 + exploration * 247, 435);
            }
            const attachment = new MessageAttachment(canvas.toBuffer(), 'genshin-card.png');
            let embed2 = new MessageEmbed()
                .setAuthor(`User: ${args[0]}`, this.client.user.avatarURL())
                .setColor('BLUE')
                .attachFiles([attachment])
                .setImage('attachment://genshin-card.png')
                .setFooter('Genshin Impact Game Module');
            await sent.delete();
            await message.channel.send(embed2);
        } else if (args[1] == '-c') {
            let editEmbed = new MessageEmbed().setDescription('Loading info......').setColor('BLUE');

            let m = await message.channel.send(editEmbed);
            try {
                const { body } = await superagent.get(`http://genshin.saya.gg/user/characters/?id=${args[0]}`);
            } catch (err) {
                let embed = new MessageEmbed()
                    .setTitle('Error')
                    .setColor('RED')
                    .setDescription(
                        `Invalid \`id\` or the users profile is not public.\n To make the profile public:\n> 1. Go to [hoyolabs](https://www.hoyolab.com/genshin/)\n> 2. Sign in\n> 3. Tap on Account info\n> 4. Toggle the bar to public.`
                    )
                    .setImage(
                        'https://cdn.discordapp.com/attachments/660507874086354945/847784123141849108/Untitled_1.png'
                    )
                    .setFooter(
                        'Note: Making your account public will not reveal any sensitive information. It will just make you game stats and other various functions public.'
                    );
                m.delete();
                return message.channel.send(embed);
            }
            await m.react('⬅️');
            await m.react('➡️');
            let current = 0;
            let charc = [];
            let level = [];
            let conste = [];
            const { body } = await superagent.get(`http://genshin.saya.gg/user/characters/?id=${args[0]}`);
            let obj = body;
            let i;
            for (i = 0; i < obj.length; i++) {
                let name = obj[i].name;
                name = name.split(/\s+/).join('');
                let emote = getCharEmote(name.toLowerCase());
                charc.push(emote);
                level.push(obj[i].level);
                conste.push(obj[i].constellation);
            }
            function createEmbed(page) {
                let charcters = charc.slice(page, page + 6);
                let levels = level.slice(page, page + 6);
                let constes = conste.slice(page, page + 6);
                let embed = new MessageEmbed()
                    .setAuthor(`User: ${args[0]}`, message.client.user.avatarURL())
                    .addField('**Character**', charcters, true)
                    .addField('**Level**', levels, true)
                    .addField('**Constellation**', constes, true)
                    .setColor('BLUE')
                    .setFooter('Genshin Impact Game Module');
                return embed;
            }

            function reactionsNeeded(page) {
                return [obj[page - 6], obj[page + 6]];
            }

            async function showPage(page) {
                let output = createEmbed(page);
                await m.edit(null, { embed: output });

                let needed = reactionsNeeded(page);
                let left, right;

                if (needed[0]) {
                    let filter = (r, u) => r.emoji.name == '⬅️' && u.id == message.author.id;

                    left = m.createReactionCollector(filter, { time: 60000 });

                    left.on('collect', (r) => {
                        if (right) right.stop();
                        left.stop();

                        showPage(current - 6);
                        current = current - 6;
                    });
                }

                if (needed[1]) {
                    let filter = (r, u) => r.emoji.name == '➡️' && u.id == message.author.id;
                    right = m.createReactionCollector(filter, { time: 60000 });

                    right.on('collect', (r) => {
                        if (left) left.stop();
                        right.stop();

                        showPage(current + 6);
                        current = current + 6;
                    });
                }
            }

            showPage(current);
        }
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCharEmote(char) {
    switch (char) {
        case 'zhongli': {
            return '<:zhongli:846495380073611295>';
        }
        case 'yanfei': {
            return '<:yanfei:846495380471676968>';
        }
        case 'xinyan': {
            return '<:xinyan:846495380342702081>';
        }
        case 'xingqiu': {
            return '<:xingqiu:846495380375339058>';
        }
        case 'xiao': {
            return '<:xiao:846495380580335656>';
        }
        case 'xiangling': {
            return '<:xiangling:846495380455161866> ';
        }
        case 'venti': {
            return '<:venti:846495380928593952>';
        }
        case 'traveler': {
            return '<:travellermale:846495380203372575>';
        }
        case 'tartaglia': {
            return '<:tartaglia:846495380467482645>';
        }
        case 'childe': {
            return '<:tartaglia:846495380467482645>';
        }
        case 'sucrose': {
            return '<:sucrose:846495380472332318>';
        }
        case 'rosaria': {
            return '<:rosaria:846495380777730108>';
        }
        case 'razor': {
            return '<:razzor:846495380715864084>';
        }
        case 'qiqi': {
            return '<:qiqi:846495380643512330>';
        }
        case 'noelle': {
            return '<:noelle:846495380437991434>';
        }
        case 'ningguang': {
            return '<:ningguang:846495380333527090>';
        }
        case 'mona': {
            return '<:mona:846495380434059335>';
        }
        case 'lisa': {
            return '<:lisa:846495380434059325>';
        }
        case 'klee': {
            return '<:klee:846495380115292161>';
        }
        case 'keqing': {
            return '<:keqing:846495380525809684>';
        }
        case 'kaeya': {
            return '<:kaeya:846495380191051786>';
        }
        case 'jean': {
            return '<:jean:846495379931660290>';
        }
        case 'hutao': {
            return '<:hutao:846495380119093278>';
        }
        case 'hu tao': {
            return '<:hutao:846495380119093278>';
        }
        case 'ganyu': {
            return '<:ganyu:846495380077805568>';
        }
        case 'fischl': {
            return '<:fischl:846495379922092062>';
        }
        case 'eula': {
            return '<:eula:846495380069417010>';
        }
        case 'diona': {
            return '<:diona:846495379196608552>';
        }
        case 'diluc': {
            return '<:diluc:846495378097438740>';
        }
        case 'chongyun': {
            return '<:chongyun:846495378144624699>';
        }
        case 'bennett': {
            return '<:bennet:846495377854824478>';
        }
        case 'beidou': {
            return '<:beidou:846495377804099645>';
        }
        case 'barbara': {
            return '<:barbara:846495377616273429>';
        }
        case 'amber': {
            return '<:amber:846495377615749170>';
        }
        case 'albedo': {
            return '<:albedo:846495377548378122>';
        }
    }
}

module.exports = GenshinCommand;
