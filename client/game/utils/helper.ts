export const getRandomMineral = (minerals: Array<{ src: string; points: number }>) => {
    const randomIndex = Math.floor(Math.random() * minerals.length);
    return minerals[randomIndex];
};
