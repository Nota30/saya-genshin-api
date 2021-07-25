export const char_en = (toTranslate: string): Promise<string> => {
    const characters = {
        阿贝多: 'Albedo',
        安柏: 'Amber',
        琴: 'Jean',
        丽莎: 'Lisa',
        凯亚: 'Kaeya',
        芭芭拉: 'Barbara',
        迪卢克: 'Diluc',
        雷泽: 'Razor',
        温迪: 'Venti',
        可莉: 'Klee',
        班尼特: 'Bennet',
        诺艾尔: 'Noelle',
        菲谢尔: 'Fischl',
        砂糖: 'Sucrose',
        莫娜: 'Mona',
        迪奥娜: 'Diona',
        罗莎莉亚: 'Rosaria',
        优菈: 'Eula',
        北斗: 'Beidou',
        魈: 'Xiao',
        凝光: 'Ningguang',
        香菱: 'Xiangling',
        行秋: 'Xingqiu',
        重云: 'Chongyun',
        刻晴: 'Keqing',
        七七: 'Qiqi',
        钟离: 'Zhongli',
        辛焱: 'Xinyan',
        甘雨: 'Ganyu',
        胡桃: 'Hu Tao',
        烟绯: 'Yanfei',
        达达利亚: 'Tartaglia',
        旅行者: 'Traveler',
        枫原万叶: 'Kaedehara Kazuha',
        神里绫华: 'Kamisato Ayaka'
    };

    const translated = characters[toTranslate];

    return translated;
};
