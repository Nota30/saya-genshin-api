export const region_en = (toTranslate: string): Promise<string> => {
    const regions = {
        龙脊雪山: 'Dragonspine',
        蒙德: 'Mondstadt',
        璃月: 'Liyue'
    };

    const translated = regions[toTranslate];

    return translated;
};
