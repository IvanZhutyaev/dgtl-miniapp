export interface MineralInfo {
  symbol: string;
  name: string;
  image: string;
  points: number;
  atomicNumber: number;
  period: number;
}

// Список реально существующих файлов спрайтов в /public/minerals/
const AVAILABLE_SPRITE_FILENAMES: string[] = [
  'Xe.png', 'U.png', 'Tm.png', 'Te.png', 'Sr.png', 'Sn.png', 'Si.png', 
  'Se.png', 'Sc.png', 'Sb.png', 'S.png', 'Re.png', 'Rb.png', 'Ra.png', 
  'Pb.png', 'P.png', 'O.png', 'No.png', 'Ne.png', 'Na.png', 'N.png', 
  'Mg.png', 'Md.png', 'Lv.png', 'Lu.png', 'LR.png', 'Li.png', 'Kr.png', 
  'K.png', 'I.png', 'Hf.png', 'H.png', 'Ge.png', 'Fr.png', 'Fe.png', 
  'F.png', 'Cu.png', 'Cs.png', 'Cm.png', 'Cl.png', 'Ci.png', 'Cf.png', 
  'Ca.png', 'C.png', 'Br.png', 'Be.png', 'Ba.png', 'B.png', 'Au.png', 
  'He.png', 'Ar.png', 'Al.png', 'Ag.png'
  // Добавьте сюда 'Ti.png', 'V.png' и т.д., если они у вас появятся
  // или если они есть, но не попали в автоматический список
];

const AVAILABLE_SPRITE_PATHS: string[] = AVAILABLE_SPRITE_FILENAMES.map(file => `/minerals/${file}`);

const getRandomFallbackImage = (): string => {
  if (AVAILABLE_SPRITE_PATHS.length === 0) {
    // Этот путь должен существовать, если список пуст, иначе будет вечная ошибка
    // Лучше убедиться, что AVAILABLE_SPRITE_PATHS не пуст
    // Можно кинуть ошибку или вернуть специальный "дефолтный" спрайт, если он есть
    console.error("CRITICAL: No available mineral sprites for fallback!");
    return '/minerals/fallback_error.png'; // Пример, если бы такой файл существовал
  }
  const randomIndex = Math.floor(Math.random() * AVAILABLE_SPRITE_PATHS.length);
  return AVAILABLE_SPRITE_PATHS[randomIndex];
};

const getMineralImage = (symbol: string): string => {
  const expectedImagePath = `/minerals/${symbol}.png`;
  if (AVAILABLE_SPRITE_PATHS.includes(expectedImagePath)) {
    return expectedImagePath;
  }
  // console.warn(`Sprite for ${symbol} (${expectedImagePath}) not found. Using random fallback.`);
  return getRandomFallbackImage();
};

export const MINERALS_DATA: Omit<MineralInfo, 'image'>[] = [
  { symbol: "H", name: "Водород", points: 1, atomicNumber: 1, period: 1 },
  { symbol: "He", name: "Гелий", points: 1, atomicNumber: 2, period: 1 },
  { symbol: "Li", name: "Литий", points: 2, atomicNumber: 3, period: 2 },
  { symbol: "Be", name: "Бериллий", points: 2, atomicNumber: 4, period: 2 },
  { symbol: "B", name: "Бор", points: 2, atomicNumber: 5, period: 2 },
  { symbol: "C", name: "Углерод", points: 2, atomicNumber: 6, period: 2 },
  { symbol: "N", name: "Азот", points: 2, atomicNumber: 7, period: 2 },
  { symbol: "O", name: "Кислород", points: 2, atomicNumber: 8, period: 2 },
  { symbol: "F", name: "Фтор", points: 2, atomicNumber: 9, period: 2 },
  { symbol: "Ne", name: "Неон", points: 2, atomicNumber: 10, period: 2 },
  { symbol: "Na", name: "Натрий", points: 3, atomicNumber: 11, period: 3 },
  { symbol: "Mg", name: "Магний", points: 3, atomicNumber: 12, period: 3 },
  { symbol: "Al", name: "Алюминий", points: 3, atomicNumber: 13, period: 3 },
  { symbol: "Si", name: "Кремний", points: 3, atomicNumber: 14, period: 3 },
  { symbol: "P", name: "Фосфор", points: 3, atomicNumber: 15, period: 3 },
  { symbol: "S", name: "Сера", points: 3, atomicNumber: 16, period: 3 },
  { symbol: "Cl", name: "Хлор", points: 3, atomicNumber: 17, period: 3 },
  { symbol: "Ar", name: "Аргон", points: 3, atomicNumber: 18, period: 3 },
  { symbol: "K", name: "Калий", points: 4, atomicNumber: 19, period: 4 },
  { symbol: "Ca", name: "Кальций", points: 4, atomicNumber: 20, period: 4 },
  { symbol: "Sc", name: "Скандий", points: 4, atomicNumber: 21, period: 4 },
  { symbol: "Ti", name: "Титан", points: 4, atomicNumber: 22, period: 4 },
  { symbol: "V", name: "Ванадий", points: 4, atomicNumber: 23, period: 4 },
  { symbol: "Cr", name: "Хром", points: 4, atomicNumber: 24, period: 4 },
  { symbol: "Mn", name: "Марганец", points: 4, atomicNumber: 25, period: 4 },
  { symbol: "Fe", name: "Железо", points: 4, atomicNumber: 26, period: 4 },
  { symbol: "Co", name: "Кобальт", points: 4, atomicNumber: 27, period: 4 },
  { symbol: "Ni", name: "Никель", points: 4, atomicNumber: 28, period: 4 },
  { symbol: "Cu", name: "Медь", points: 4, atomicNumber: 29, period: 4 },
  { symbol: "Zn", name: "Цинк", points: 4, atomicNumber: 30, period: 4 },
  { symbol: "Ga", name: "Галлий", points: 5, atomicNumber: 31, period: 4 },
  { symbol: "Ge", name: "Германий", points: 5, atomicNumber: 32, period: 4 },
  { symbol: "As", name: "Мышьяк", points: 5, atomicNumber: 33, period: 4 },
  { symbol: "Se", name: "Селен", points: 5, atomicNumber: 34, period: 4 },
  { symbol: "Br", name: "Бром", points: 5, atomicNumber: 35, period: 4 },
  { symbol: "Kr", name: "Криптон", points: 5, atomicNumber: 36, period: 4 },
  { symbol: "Rb", name: "Рубидий", points: 6, atomicNumber: 37, period: 5 },
  { symbol: "Sr", name: "Стронций", points: 6, atomicNumber: 38, period: 5 },
  { symbol: "Y", name: "Иттрий", points: 6, atomicNumber: 39, period: 5 },
  { symbol: "Zr", name: "Цирконий", points: 6, atomicNumber: 40, period: 5 },
  { symbol: "Nb", name: "Ниобий", points: 6, atomicNumber: 41, period: 5 },
  { symbol: "Mo", name: "Молибден", points: 6, atomicNumber: 42, period: 5 },
  { symbol: "Tc", name: "Технеций", points: 7, atomicNumber: 43, period: 5 },
  { symbol: "Ru", name: "Рутений", points: 7, atomicNumber: 44, period: 5 },
  { symbol: "Rh", name: "Родий", points: 7, atomicNumber: 45, period: 5 },
  { symbol: "Pd", name: "Палладий", points: 7, atomicNumber: 46, period: 5 },
  { symbol: "Ag", name: "Серебро", points: 7, atomicNumber: 47, period: 5 },
  { symbol: "Cd", name: "Кадмий", points: 7, atomicNumber: 48, period: 5 },
  { symbol: "In", name: "Индий", points: 7, atomicNumber: 49, period: 5 },
  { symbol: "Sn", name: "Олово", points: 7, atomicNumber: 50, period: 5 },
  { symbol: "Sb", name: "Сурьма", points: 7, atomicNumber: 51, period: 5 },
  { symbol: "Te", name: "Теллур", points: 7, atomicNumber: 52, period: 5 },
  { symbol: "I", name: "Йод", points: 7, atomicNumber: 53, period: 5 },
  { symbol: "Xe", name: "Ксенон", points: 7, atomicNumber: 54, period: 5 },
  { symbol: "Cs", name: "Цезий", points: 8, atomicNumber: 55, period: 6 },
  { symbol: "Ba", name: "Барий", points: 8, atomicNumber: 56, period: 6 },
  { symbol: "La", name: "Лантан", points: 8, atomicNumber: 57, period: 6 },
  { symbol: "Ce", name: "Церий", points: 8, atomicNumber: 58, period: 6 },
  { symbol: "Pr", name: "Празеодим", points: 8, atomicNumber: 59, period: 6 },
  { symbol: "Nd", name: "Неодим", points: 8, atomicNumber: 60, period: 6 },
  { symbol: "Pm", name: "Прометий", points: 9, atomicNumber: 61, period: 6 },
  { symbol: "Sm", name: "Самарий", points: 9, atomicNumber: 62, period: 6 },
  { symbol: "Eu", name: "Европий", points: 9, atomicNumber: 63, period: 6 },
  { symbol: "Gd", name: "Гадолиний", points: 9, atomicNumber: 64, period: 6 },
  { symbol: "Tb", name: "Тербий", points: 9, atomicNumber: 65, period: 6 },
  { symbol: "Dy", name: "Диспрозий", points: 9, atomicNumber: 66, period: 6 },
  { symbol: "Ho", name: "Гольмий", points: 9, atomicNumber: 67, period: 6 },
  { symbol: "Er", name: "Эрбий", points: 9, atomicNumber: 68, period: 6 },
  { symbol: "Tm", name: "Тулий", points: 9, atomicNumber: 69, period: 6 },
  { symbol: "Yb", name: "Иттербий", points: 9, atomicNumber: 70, period: 6 },
  { symbol: "Lu", name: "Лютеций", points: 9, atomicNumber: 71, period: 6 },
  { symbol: "Hf", name: "Гафний", points: 10, atomicNumber: 72, period: 6 },
  { symbol: "Ta", name: "Тантал", points: 10, atomicNumber: 73, period: 6 },
  { symbol: "W", name: "Вольфрам", points: 10, atomicNumber: 74, period: 6 },
  { symbol: "Re", name: "Рений", points: 10, atomicNumber: 75, period: 6 },
  { symbol: "Os", name: "Осмий", points: 10, atomicNumber: 76, period: 6 },
  { symbol: "Ir", name: "Иридий", points: 10, atomicNumber: 77, period: 6 },
  { symbol: "Pt", name: "Платина", points: 10, atomicNumber: 78, period: 6 },
  { symbol: "Au", name: "Золото", points: 10, atomicNumber: 79, period: 6 },
  { symbol: "Hg", name: "Ртуть", points: 10, atomicNumber: 80, period: 6 },
  { symbol: "Tl", name: "Таллий", points: 10, atomicNumber: 81, period: 6 },
  { symbol: "Pb", name: "Свинец", points: 10, atomicNumber: 82, period: 6 },
  { symbol: "Bi", name: "Висмут", points: 10, atomicNumber: 83, period: 6 },
  { symbol: "Po", name: "Полоний", points: 11, atomicNumber: 84, period: 6 },
  { symbol: "At", name: "Астат", points: 11, atomicNumber: 85, period: 6 },
  { symbol: "Rn", name: "Радон", points: 11, atomicNumber: 86, period: 6 },
  { symbol: "Fr", name: "Франций", points: 12, atomicNumber: 87, period: 7 },
  { symbol: "Ra", name: "Радий", points: 12, atomicNumber: 88, period: 7 },
  { symbol: "Ac", name: "Актиний", points: 12, atomicNumber: 89, period: 7 },
  { symbol: "Th", name: "Торий", points: 12, atomicNumber: 90, period: 7 },
  { symbol: "Pa", name: "Протактиний", points: 12, atomicNumber: 91, period: 7 },
  { symbol: "U", name: "Уран", points: 13, atomicNumber: 92, period: 7 },
  { symbol: "Np", name: "Нептуний", points: 13, atomicNumber: 93, period: 7 },
  { symbol: "Pu", name: "Плутоний", points: 13, atomicNumber: 94, period: 7 },
  { symbol: "Am", name: "Америций", points: 13, atomicNumber: 95, period: 7 },
  { symbol: "Cm", name: "Кюрий", points: 13, atomicNumber: 96, period: 7 },
  { symbol: "Bk", name: "Берклий", points: 13, atomicNumber: 97, period: 7 },
  { symbol: "Cf", name: "Калифорний", points: 13, atomicNumber: 98, period: 7 },
  { symbol: "Es", name: "Эйнштейний", points: 13, atomicNumber: 99, period: 7 },
  { symbol: "Fm", name: "Фермий", points: 13, atomicNumber: 100, period: 7 },
  { symbol: "Md", name: "Менделевий", points: 14, atomicNumber: 101, period: 7 },
  { symbol: "No", name: "Нобелий", points: 14, atomicNumber: 102, period: 7 },
  { symbol: "Lr", name: "Лоуренсий", points: 14, atomicNumber: 103, period: 7 },
  { symbol: "Rf", name: "Резерфордий", points: 15, atomicNumber: 104, period: 7 },
  { symbol: "Db", name: "Дубний", points: 15, atomicNumber: 105, period: 7 },
  { symbol: "Sg", name: "Сиборгий", points: 15, atomicNumber: 106, period: 7 },
  { symbol: "Bh", name: "Борий", points: 15, atomicNumber: 107, period: 7 },
  { symbol: "Hs", name: "Хассий", points: 15, atomicNumber: 108, period: 7 },
  { symbol: "Mt", name: "Мейтнерий", points: 15, atomicNumber: 109, period: 7 },
  { symbol: "Ds", name: "Дармштадтий", points: 16, atomicNumber: 110, period: 7 },
  { symbol: "Rg", name: "Рентгений", points: 16, atomicNumber: 111, period: 7 },
  { symbol: "Cn", name: "Коперниций", points: 16, atomicNumber: 112, period: 7 },
  { symbol: "Nh", name: "Нихоний", points: 16, atomicNumber: 113, period: 7 },
  { symbol: "Fl", name: "Флеровий", points: 16, atomicNumber: 114, period: 7 },
  { symbol: "Mc", name: "Московий", points: 16, atomicNumber: 115, period: 7 },
  { symbol: "Lv", name: "Ливерморий", points: 16, atomicNumber: 116, period: 7 },
  { symbol: "Ts", name: "Теннессин", points: 16, atomicNumber: 117, period: 7 },
  { symbol: "Og", name: "Оганесон", points: 16, atomicNumber: 118, period: 7 },
];

export const MINERALS: MineralInfo[] = MINERALS_DATA.map(m => ({
  ...m,
  image: getMineralImage(m.symbol)
})); 