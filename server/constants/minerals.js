import path from 'path';
import fs from 'fs';

// Список реально существующих файлов спрайтов в client/public/minerals/
// Пути должны быть относительно директории public, т.е. начинаться с /minerals/
const availableSpriteFiles = [
  'Xe.png', 'U.png', 'Tm.png', 'Te.png', 'Sr.png', 'Sn.png', 'Si.png', 
  'Se.png', 'Sc.png', 'Sb.png', 'S.png', 'Re.png', 'Rb.png', 'Ra.png', 
  'Pb.png', 'P.png', 'O.png', 'No.png', 'Ne.png', 'Na.png', 'N.png', 
  'Mg.png', 'Md.png', 'Lv.png', 'Lu.png', 'LR.png', 'Li.png', 'Kr.png', 
  'K.png', 'I.png', 'Hf.png', 'H.png', 'Ge.png', 'Fr.png', 'Fe.png', 
  'F.png', 'Cu.png', 'Cs.png', 'Cm.png', 'Cl.png', 'Ci.png', 'Cf.png', 
  'Ca.png', 'C.png', 'Br.png', 'Be.png', 'Ba.png', 'B.png', 'Au.png', 
  'He.png', 'Ar.png', 'Al.png', 'Ag.png'
];

const availableSpritePaths = availableSpriteFiles.map(file => `/minerals/${file}`);

const getRandomFallbackImage = () => {
  if (availableSpritePaths.length === 0) {
    return '/minerals/default.png'; // Крайний случай, если вдруг список пуст
  }
  const randomIndex = Math.floor(Math.random() * availableSpritePaths.length);
  return availableSpritePaths[randomIndex];
};

// Функция для проверки существования файла спрайта (упрощенная, т.к. availableSpritePaths уже содержит существующие)
const getValidImageOrDefault = (imagePath) => {
  if (imagePath && availableSpritePaths.includes(imagePath)) {
    return imagePath;
  }
  // Если указанный imagePath не существует в нашем списке или не указан, возвращаем случайный
  console.warn(`Sprite ${imagePath} not found or not specified. Using random fallback.`);
  return getRandomFallbackImage();
};


export const MINERALS_OLD = [
  // ... (старые данные, если они тут были)
];


export const MINERALS = [
  { symbol: "H", name: "Водород", image: "/minerals/H.png", points: 1, atomicNumber: 1, period: 1 },
  { symbol: "He", name: "Гелий", image: "/minerals/He.png", points: 1, atomicNumber: 2, period: 1 },
  { symbol: "Li", name: "Литий", image: "/minerals/Li.png", points: 2, atomicNumber: 3, period: 2 },
  { symbol: "Be", name: "Бериллий", image: "/minerals/Be.png", points: 2, atomicNumber: 4, period: 2 },
  { symbol: "B", name: "Бор", image: "/minerals/B.png", points: 2, atomicNumber: 5, period: 2 },
  { symbol: "C", name: "Углерод", image: "/minerals/C.png", points: 2, atomicNumber: 6, period: 2 },
  { symbol: "N", name: "Азот", image: "/minerals/N.png", points: 2, atomicNumber: 7, period: 2 },
  { symbol: "O", name: "Кислород", image: "/minerals/O.png", points: 2, atomicNumber: 8, period: 2 },
  { symbol: "F", name: "Фтор", image: "/minerals/F.png", points: 3, atomicNumber: 9, period: 2 },
  { symbol: "Ne", name: "Неон", image: "/minerals/Ne.png", points: 3, atomicNumber: 10, period: 2 },
  { symbol: "Na", name: "Натрий", image: "/minerals/Na.png", points: 3, atomicNumber: 11, period: 3 },
  { symbol: "Mg", name: "Магний", image: "/minerals/Mg.png", points: 3, atomicNumber: 12, period: 3 },
  { symbol: "Al", name: "Алюминий", image: "/minerals/Al.png", points: 3, atomicNumber: 13, period: 3 },
  { symbol: "Si", name: "Кремний", image: "/minerals/Si.png", points: 3, atomicNumber: 14, period: 3 },
  { symbol: "P", name: "Фосфор", image: "/minerals/P.png", points: 4, atomicNumber: 15, period: 3 },
  { symbol: "S", name: "Сера", image: "/minerals/S.png", points: 4, atomicNumber: 16, period: 3 },
  { symbol: "Cl", name: "Хлор", image: "/minerals/Cl.png", points: 4, atomicNumber: 17, period: 3 },
  { symbol: "Ar", name: "Аргон", image: "/minerals/Ar.png", points: 4, atomicNumber: 18, period: 3 },
  { symbol: "K", name: "Калий", image: "/minerals/K.png", points: 4, atomicNumber: 19, period: 4 },
  { symbol: "Ca", name: "Кальций", image: "/minerals/Ca.png", points: 4, atomicNumber: 20, period: 4 },
  { symbol: "Sc", name: "Скандий", image: "/minerals/Sc.png", points: 5, atomicNumber: 21, period: 4 },
  { symbol: "Ti", name: "Титан", image: "/minerals/placeholder.png", points: 5, atomicNumber: 22, period: 4 }, // Пример отсутствующего
  { symbol: "V", name: "Ванадий", image: "/minerals/placeholder.png", points: 5, atomicNumber: 23, period: 4 },
  { symbol: "Cr", name: "Хром", image: "/minerals/placeholder.png", points: 5, atomicNumber: 24, period: 4 },
  { symbol: "Mn", name: "Марганец", image: "/minerals/placeholder.png", points: 5, atomicNumber: 25, period: 4 },
  { symbol: "Fe", name: "Железо", image: "/minerals/Fe.png", points: 5, atomicNumber: 26, period: 4 },
  { symbol: "Co", name: "Кобальт", image: "/minerals/placeholder.png", points: 6, atomicNumber: 27, period: 4 },
  { symbol: "Ni", name: "Никель", image: "/minerals/placeholder.png", points: 6, atomicNumber: 28, period: 4 },
  { symbol: "Cu", name: "Медь", image: "/minerals/Cu.png", points: 6, atomicNumber: 29, period: 4 },
  { symbol: "Zn", name: "Цинк", image: "/minerals/placeholder.png", points: 6, atomicNumber: 30, period: 4 },
  { symbol: "Ga", name: "Галлий", image: "/minerals/placeholder.png", points: 6, atomicNumber: 31, period: 4 },
  { symbol: "Ge", name: "Германий", image: "/minerals/Ge.png", points: 6, atomicNumber: 32, period: 4 },
  { symbol: "As", name: "Мышьяк", image: "/minerals/placeholder.png", points: 7, atomicNumber: 33, period: 4 },
  { symbol: "Se", name: "Селен", image: "/minerals/Se.png", points: 7, atomicNumber: 34, period: 4 },
  { symbol: "Br", name: "Бром", image: "/minerals/Br.png", points: 7, atomicNumber: 35, period: 4 },
  { symbol: "Kr", name: "Криптон", image: "/minerals/Kr.png", points: 7, atomicNumber: 36, period: 4 },
  { symbol: "Rb", name: "Рубидий", image: "/minerals/Rb.png", points: 6, atomicNumber: 37, period: 5 },
  { symbol: "Sr", name: "Стронций", image: "/minerals/Sr.png", points: 6, atomicNumber: 38, period: 5 },
  { symbol: "Y", name: "Иттрий", image: "/minerals/Y.png", points: 6, atomicNumber: 39, period: 5 }, // Assuming Y.png exists
  { symbol: "Zr", name: "Цирконий", image: "/minerals/Zr.png", points: 6, atomicNumber: 40, period: 5 }, // Assuming Zr.png exists
  { symbol: "Nb", name: "Ниобий", image: "/minerals/Nb.png", points: 6, atomicNumber: 41, period: 5 }, // Assuming Nb.png exists
  { symbol: "Mo", name: "Молибден", image: "/minerals/Mo.png", points: 6, atomicNumber: 42, period: 5 }, // Assuming Mo.png exists
  { symbol: "Tc", name: "Технеций", image: "/minerals/Tc.png", points: 7, atomicNumber: 43, period: 5 }, // Assuming Tc.png exists
  { symbol: "Ru", name: "Рутений", image: "/minerals/Ru.png", points: 7, atomicNumber: 44, period: 5 }, // Assuming Ru.png exists
  { symbol: "Rh", name: "Родий", image: "/minerals/Rh.png", points: 7, atomicNumber: 45, period: 5 }, // Assuming Rh.png exists
  { symbol: "Pd", name: "Палладий", image: "/minerals/Pd.png", points: 7, atomicNumber: 46, period: 5 }, // Assuming Pd.png exists
  { symbol: "Ag", name: "Серебро", image: "/minerals/Ag.png", points: 7, atomicNumber: 47, period: 5 },
  { symbol: "Cd", name: "Кадмий", image: "/minerals/Cd.png", points: 7, atomicNumber: 48, period: 5 }, // Assuming Cd.png exists
  { symbol: "In", name: "Индий", image: "/minerals/In.png", points: 7, atomicNumber: 49, period: 5 }, // Assuming In.png exists
  { symbol: "Sn", name: "Олово", image: "/minerals/Sn.png", points: 7, atomicNumber: 50, period: 5 },
  { symbol: "Sb", name: "Сурьма", image: "/minerals/Sb.png", points: 7, atomicNumber: 51, period: 5 },
  { symbol: "Te", name: "Теллур", image: "/minerals/Te.png", points: 7, atomicNumber: 52, period: 5 },
  { symbol: "I", name: "Йод", image: "/minerals/I.png", points: 7, atomicNumber: 53, period: 5 },
  { symbol: "Xe", name: "Ксенон", image: "/minerals/Xe.png", points: 7, atomicNumber: 54, period: 5 },
  { symbol: "Cs", name: "Цезий", image: "/minerals/Cs.png", points: 8, atomicNumber: 55, period: 6 },
  { symbol: "Ba", name: "Барий", image: "/minerals/Ba.png", points: 8, atomicNumber: 56, period: 6 },
  { symbol: "La", name: "Лантан", image: "/minerals/La.png", points: 8, atomicNumber: 57, period: 6 }, // Assuming La.png exists
  { symbol: "Ce", name: "Церий", image: "/minerals/Ce.png", points: 8, atomicNumber: 58, period: 6 }, // Assuming Ce.png exists
  { symbol: "Pr", name: "Празеодим", image: "/minerals/Pr.png", points: 8, atomicNumber: 59, period: 6 }, // Assuming Pr.png exists
  { symbol: "Nd", name: "Неодим", image: "/minerals/Nd.png", points: 8, atomicNumber: 60, period: 6 }, // Assuming Nd.png exists
  { symbol: "Pm", name: "Прометий", image: "/minerals/Pm.png", points: 9, atomicNumber: 61, period: 6 }, // Assuming Pm.png exists
  { symbol: "Sm", name: "Самарий", image: "/minerals/Sm.png", points: 9, atomicNumber: 62, period: 6 }, // Assuming Sm.png exists
  { symbol: "Eu", name: "Европий", image: "/minerals/Eu.png", points: 9, atomicNumber: 63, period: 6 }, // Assuming Eu.png exists
  { symbol: "Gd", name: "Гадолиний", image: "/minerals/Gd.png", points: 9, atomicNumber: 64, period: 6 }, // Assuming Gd.png exists
  { symbol: "Tb", name: "Тербий", image: "/minerals/Tb.png", points: 9, atomicNumber: 65, period: 6 }, // Assuming Tb.png exists
  { symbol: "Dy", name: "Диспрозий", image: "/minerals/Dy.png", points: 9, atomicNumber: 66, period: 6 }, // Assuming Dy.png exists
  { symbol: "Ho", name: "Гольмий", image: "/minerals/Ho.png", points: 9, atomicNumber: 67, period: 6 }, // Assuming Ho.png exists
  { symbol: "Er", name: "Эрбий", image: "/minerals/Er.png", points: 9, atomicNumber: 68, period: 6 }, // Assuming Er.png exists
  { symbol: "Tm", name: "Тулий", image: "/minerals/Tm.png", points: 9, atomicNumber: 69, period: 6 },
  { symbol: "Yb", name: "Иттербий", image: "/minerals/Yb.png", points: 9, atomicNumber: 70, period: 6 }, // Assuming Yb.png exists
  { symbol: "Lu", name: "Лютеций", image: "/minerals/Lu.png", points: 9, atomicNumber: 71, period: 6 },
  { symbol: "Hf", name: "Гафний", image: "/minerals/Hf.png", points: 10, atomicNumber: 72, period: 6 },
  { symbol: "Ta", name: "Тантал", image: "/minerals/placeholder.png", points: 10, atomicNumber: 73, period: 6 },
  { symbol: "W", name: "Вольфрам", image: "/minerals/placeholder.png", points: 10, atomicNumber: 74, period: 6 },
  { symbol: "Re", name: "Рений", image: "/minerals/Re.png", points: 10, atomicNumber: 75, period: 6 },
  { symbol: "Os", name: "Осмий", image: "/minerals/placeholder.png", points: 10, atomicNumber: 76, period: 6 },
  { symbol: "Ir", name: "Иридий", image: "/minerals/placeholder.png", points: 10, atomicNumber: 77, period: 6 },
  { symbol: "Pt", name: "Платина", image: "/minerals/Pt.png", points: 11, atomicNumber: 78, period: 6 }, // Assuming Pt.png exists
  { symbol: "Au", name: "Золото", image: "/minerals/Au.png", points: 11, atomicNumber: 79, period: 6 },
  { symbol: "Hg", name: "Ртуть", image: "/minerals/Hg.png", points: 11, atomicNumber: 80, period: 6 }, // Assuming Hg.png exists
  { symbol: "Tl", name: "Таллий", image: "/minerals/Tl.png", points: 11, atomicNumber: 81, period: 6 }, // Assuming Tl.png exists
  { symbol: "Pb", name: "Свинец", image: "/minerals/Pb.png", points: 11, atomicNumber: 82, period: 6 },
  { symbol: "Bi", name: "Висмут", image: "/minerals/Bi.png", points: 11, atomicNumber: 83, period: 6 }, // Assuming Bi.png exists
  { symbol: "Po", name: "Полоний", image: "/minerals/Po.png", points: 12, atomicNumber: 84, period: 6 }, // Assuming Po.png exists
  { symbol: "At", name: "Астат", image: "/minerals/At.png", points: 12, atomicNumber: 85, period: 6 }, // Assuming At.png exists
  { symbol: "Rn", name: "Радон", image: "/minerals/Rn.png", points: 12, atomicNumber: 86, period: 6 }, // Assuming Rn.png exists
  { symbol: "Fr", name: "Франций", image: "/minerals/Fr.png", points: 12, atomicNumber: 87, period: 7 },
  { symbol: "Ra", name: "Радий", image: "/minerals/Ra.png", points: 12, atomicNumber: 88, period: 7 },
  { symbol: "Ac", name: "Актиний", image: "/minerals/Ac.png", points: 12, atomicNumber: 89, period: 7 }, // Assuming Ac.png exists
  { symbol: "Th", name: "Торий", image: "/minerals/Th.png", points: 12, atomicNumber: 90, period: 7 }, // Assuming Th.png exists
  { symbol: "Pa", name: "Протактиний", image: "/minerals/Pa.png", points: 12, atomicNumber: 91, period: 7 }, // Assuming Pa.png exists
  { symbol: "U", name: "Уран", image: "/minerals/U.png", points: 13, atomicNumber: 92, period: 7 },
  { symbol: "Np", name: "Нептуний", image: "/minerals/Np.png", points: 13, atomicNumber: 93, period: 7 }, // Assuming Np.png exists
  { symbol: "Pu", name: "Плутоний", image: "/minerals/Pu.png", points: 13, atomicNumber: 94, period: 7 }, // Assuming Pu.png exists
  { symbol: "Am", name: "Америций", image: "/minerals/Am.png", points: 13, atomicNumber: 95, period: 7 }, // Assuming Am.png exists
  { symbol: "Cm", name: "Кюрий", image: "/minerals/Cm.png", points: 13, atomicNumber: 96, period: 7 },
  { symbol: "Bk", name: "Берклий", image: "/minerals/Bk.png", points: 13, atomicNumber: 97, period: 7 }, // Assuming Bk.png exists
  { symbol: "Cf", name: "Калифорний", image: "/minerals/Cf.png", points: 13, atomicNumber: 98, period: 7 },
  { symbol: "Es", name: "Эйнштейний", image: "/minerals/Es.png", points: 13, atomicNumber: 99, period: 7 }, // Assuming Es.png exists
  { symbol: "Fm", name: "Фермий", image: "/minerals/Fm.png", points: 13, atomicNumber: 100, period: 7 }, // Assuming Fm.png exists
  { symbol: "Md", name: "Менделевий", image: "/minerals/Md.png", points: 14, atomicNumber: 101, period: 7 },
  { symbol: "No", name: "Нобелий", image: "/minerals/No.png", points: 14, atomicNumber: 102, period: 7 },
  { symbol: "Lr", name: "Лоуренсий", image: "/minerals/LR.png", points: 14, atomicNumber: 103, period: 7 },
  { symbol: "Rf", name: "Резерфордий", image: "/minerals/Rf.png", points: 15, atomicNumber: 104, period: 7 }, // Assuming Rf.png exists
  { symbol: "Db", name: "Дубний", image: "/minerals/Db.png", points: 15, atomicNumber: 105, period: 7 }, // Assuming Db.png exists
  { symbol: "Sg", name: "Сиборгий", image: "/minerals/Sg.png", points: 15, atomicNumber: 106, period: 7 }, // Assuming Sg.png exists
  { symbol: "Bh", name: "Борий", image: "/minerals/Bh.png", points: 15, atomicNumber: 107, period: 7 }, // Assuming Bh.png exists
  { symbol: "Hs", name: "Хассий", image: "/minerals/Hs.png", points: 15, atomicNumber: 108, period: 7 }, // Assuming Hs.png exists
  { symbol: "Mt", name: "Мейтнерий", image: "/minerals/Mt.png", points: 15, atomicNumber: 109, period: 7 }, // Assuming Mt.png exists
  { symbol: "Ds", name: "Дармштадтий", image: "/minerals/Ds.png", points: 16, atomicNumber: 110, period: 7 }, // Assuming Ds.png exists
  { symbol: "Rg", name: "Рентгений", image: "/minerals/Rg.png", points: 16, atomicNumber: 111, period: 7 }, // Assuming Rg.png exists
  { symbol: "Cn", name: "Коперниций", image: "/minerals/Cn.png", points: 16, atomicNumber: 112, period: 7 }, // Assuming Cn.png exists
  { symbol: "Nh", name: "Нихоний", image: "/minerals/Nh.png", points: 16, atomicNumber: 113, period: 7 }, // Assuming Nh.png exists
  { symbol: "Fl", name: "Флеровий", image: "/minerals/Fl.png", points: 16, atomicNumber: 114, period: 7 }, // Assuming Fl.png exists
  { symbol: "Mc", name: "Московий", image: "/minerals/Mc.png", points: 16, atomicNumber: 115, period: 7 }, // Assuming Mc.png exists
  { symbol: "Lv", name: "Ливерморий", image: "/minerals/Lv.png", points: 16, atomicNumber: 116, period: 7 },
  { symbol: "Ts", name: "Теннессин", image: "/minerals/Ts.png", points: 17, atomicNumber: 117, period: 7 }, // Assuming Ts.png exists
  { symbol: "Og", name: "Оганесон", image: "/minerals/Og.png", points: 17, atomicNumber: 118, period: 7 } // Assuming Og.png exists
].map(mineral => ({
  ...mineral,
  image: getValidImageOrDefault(mineral.image)
}));

// Предполагается, что у вас есть MineralInfo тип, если вы используете TypeScript
// interface MineralInfo {
//   symbol: string;
//   name: string;
//   image: string;
//   points: number;
//   atomicNumber: number;
//   period: number;
// } 