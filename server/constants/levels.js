const levels = [
    {
        order: 1,
        name: "Базовый уровень",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level1_video.mp4",
        requiredScore: 0,
        duration: 60, 
        colorScheme: { primary: "#4CAF50", secondary: "#8BC34A" },
        minerals: [
            { name: "Бром", symbol: "Br", imageSrc: "/minerals/Br.png", score: 10, frequency: 0.1 },
            { name: "Золото", symbol: "Au", imageSrc: "/minerals/Au.png", score: 100, frequency: 0.01 },
            { name: "Углерод", symbol: "C", imageSrc: "/minerals/C.png", score: 20, frequency: 0.05 },
            { name: "Железо", symbol: "Fe", imageSrc: "/minerals/Fe.png", score: 15, frequency: 0.08 },
            { name: "Кислород", symbol: "O", imageSrc: "/minerals/O.png", score: 5, frequency: 0.12 },
            { name: "Серебро", symbol: "Ag", imageSrc: "/minerals/Ag.png", score: 75, frequency: 0.02 }
        ]
    },
    {
        order: 2,
        name: "Щелочные металлы",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level2_video.mp4",
        requiredScore: 1000,
        duration: 70, 
        colorScheme: { primary: "#FFC107", secondary: "#FF9800" },
        minerals: [
            { name: "Литий", symbol: "Li", imageSrc: "/minerals/Li.png", score: 20, frequency: 0.1 },
            { name: "Натрий", symbol: "Na", imageSrc: "/minerals/Na.png", score: 25, frequency: 0.08 },
            { name: "Калий", symbol: "K", imageSrc: "/minerals/K.png", score: 30, frequency: 0.07 },
            { name: "Рубидий", symbol: "Rb", imageSrc: "/minerals/Rb.png", score: 40, frequency: 0.05 },
            { name: "Цезий", symbol: "Cs", imageSrc: "/minerals/Cs.png", score: 50, frequency: 0.03 }
        ]
    },
    {
        order: 3,
        name: "Галогены и благородные газы",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level3_video.mp4",
        requiredScore: 2000,
        duration: 75,
        colorScheme: { primary: "#2196F3", secondary: "#03A9F4" },
        minerals: [
            { name: "Фтор", symbol: "F", imageSrc: "/minerals/F.png", score: 30, frequency: 0.08 },
            { name: "Хлор", symbol: "Cl", imageSrc: "/minerals/Cl.png", score: 25, frequency: 0.09 },
            { name: "Неон", symbol: "Ne", imageSrc: "/minerals/Ne.png", score: 40, frequency: 0.06 },
            { name: "Аргон", symbol: "Ar", imageSrc: "/minerals/Ar.png", score: 35, frequency: 0.07 },
            { name: "Криптон", symbol: "Kr", imageSrc: "/minerals/Kr.png", score: 50, frequency: 0.04 }
        ]
    },
    {
        order: 4,
        name: "Переходные металлы",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level4_video.mp4",
        requiredScore: 3000,
        duration: 80,
        colorScheme: { primary: "#9C27B0", secondary: "#673AB7" },
        minerals: [
            { name: "Титан", symbol: "Ti", imageSrc: "/minerals/Ti.png", score: 40, frequency: 0.06 },
            { name: "Ванадий", symbol: "V", imageSrc: "/minerals/V.png", score: 45, frequency: 0.05 },
            { name: "Хром", symbol: "Cr", imageSrc: "/minerals/Cr.png", score: 50, frequency: 0.04 },
            { name: "Марганец", symbol: "Mn", imageSrc: "/minerals/Mn.png", score: 35, frequency: 0.07 },
            { name: "Кобальт", symbol: "Co", imageSrc: "/minerals/Co.png", score: 60, frequency: 0.03 }
        ]
    },
    {
        order: 5,
        name: "Лантаноиды",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level5_video.mp4",
        requiredScore: 4000,
        duration: 85,
        colorScheme: { primary: "#E91E63", secondary: "#F06292" },
        minerals: [
            { name: "Лантан", symbol: "La", imageSrc: "/minerals/La.png", score: 50, frequency: 0.05 },
            { name: "Церий", symbol: "Ce", imageSrc: "/minerals/Ce.png", score: 55, frequency: 0.04 },
            { name: "Неодим", symbol: "Nd", imageSrc: "/minerals/Nd.png", score: 60, frequency: 0.03 },
            { name: "Самарий", symbol: "Sm", imageSrc: "/minerals/Sm.png", score: 65, frequency: 0.02 },
            { name: "Европий", symbol: "Eu", imageSrc: "/minerals/Eu.png", score: 70, frequency: 0.01 }
        ]
    },
    {
        order: 6,
        name: "Актиноиды",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level6_video.mp4",
        requiredScore: 5000,
        duration: 90,
        colorScheme: { primary: "#795548", secondary: "#8D6E63" },
        minerals: [
            { name: "Актиний", symbol: "Ac", imageSrc: "/minerals/Ac.png", score: 60, frequency: 0.04 },
            { name: "Торий", symbol: "Th", imageSrc: "/minerals/Th.png", score: 65, frequency: 0.03 },
            { name: "Уран", symbol: "U", imageSrc: "/minerals/U.png", score: 80, frequency: 0.01 },
            { name: "Нептуний", symbol: "Np", imageSrc: "/minerals/Np.png", score: 70, frequency: 0.02 },
            { name: "Плутоний", symbol: "Pu", imageSrc: "/minerals/Pu.png", score: 75, frequency: 0.015 }
        ]
    },
    {
        order: 7,
        name: "Главная группа",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level7_video.mp4",
        requiredScore: 6000,
        duration: 95,
        colorScheme: { primary: "#009688", secondary: "#4DB6AC" },
        minerals: [
            { name: "Бор", symbol: "B", imageSrc: "/minerals/B.png", score: 30, frequency: 0.07 },
            { name: "Алюминий", symbol: "Al", imageSrc: "/minerals/Al.png", score: 25, frequency: 0.08 },
            { name: "Кремний", symbol: "Si", imageSrc: "/minerals/Si.png", score: 35, frequency: 0.06 },
            { name: "Фосфор", symbol: "P", imageSrc: "/minerals/P.png", score: 20, frequency: 0.09 },
            { name: "Сера", symbol: "S", imageSrc: "/minerals/S.png", score: 15, frequency: 0.1 }
        ]
    },
    {
        order: 8,
        name: "Щелочноземельные металлы",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level8_video.mp4",
        requiredScore: 7000,
        duration: 100,
        colorScheme: { primary: "#FF5722", secondary: "#FF8A65" },
        minerals: [
            { name: "Бериллий", symbol: "Be", imageSrc: "/minerals/Be.png", score: 40, frequency: 0.06 },
            { name: "Магний", symbol: "Mg", imageSrc: "/minerals/Mg.png", score: 30, frequency: 0.07 },
            { name: "Кальций", symbol: "Ca", imageSrc: "/minerals/Ca.png", score: 25, frequency: 0.08 },
            { name: "Стронций", symbol: "Sr", imageSrc: "/minerals/Sr.png", score: 45, frequency: 0.05 },
            { name: "Барий", symbol: "Ba", imageSrc: "/minerals/Ba.png", score: 50, frequency: 0.04 }
        ]
    },
    {
        order: 9,
        name: "Постпереходные металлы",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level9_video.mp4",
        requiredScore: 8000,
        duration: 105,
        colorScheme: { primary: "#607D8B", secondary: "#78909C" },
        minerals: [
            { name: "Галлий", symbol: "Ga", imageSrc: "/minerals/Ga.png", score: 50, frequency: 0.05 },
            { name: "Индий", symbol: "In", imageSrc: "/minerals/In.png", score: 55, frequency: 0.04 },
            { name: "Олово", symbol: "Sn", imageSrc: "/minerals/Sn.png", score: 40, frequency: 0.06 },
            { name: "Свинец", symbol: "Pb", imageSrc: "/minerals/Pb.png", score: 30, frequency: 0.07 },
            { name: "Висмут", symbol: "Bi", imageSrc: "/minerals/Bi.png", score: 60, frequency: 0.03 }
        ]
    },
    {
        order: 10,
        name: "Смешанный уровень",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level10_video.mp4",
        requiredScore: 9000,
        duration: 110,
        colorScheme: { primary: "#FFEB3B", secondary: "#FFF176" },
        minerals: [
            { name: "Платина", symbol: "Pt", imageSrc: "/minerals/Pt.png", score: 120, frequency: 0.01 },
            { name: "Ртуть", symbol: "Hg", imageSrc: "/minerals/Hg.png", score: 70, frequency: 0.02 },
            { name: "Никель", symbol: "Ni", imageSrc: "/minerals/Ni.png", score: 45, frequency: 0.05 },
            { name: "Водород", symbol: "H", imageSrc: "/minerals/H.png", score: 5, frequency: 0.1 },
            { name: "Гелий", symbol: "He", imageSrc: "/minerals/He.png", score: 10, frequency: 0.08 }
        ]
    },
    {
        order: 11,
        name: "Редкоземельные элементы",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level11_video.mp4",
        requiredScore: 10000,
        duration: 115,
        colorScheme: { primary: "#4CAF50", secondary: "#A5D6A7" }, // Similar to basic but lighter
        minerals: [
            { name: "Скандий", symbol: "Sc", imageSrc: "/minerals/Sc.png", score: 60, frequency: 0.03 },
            { name: "Иттрий", symbol: "Y", imageSrc: "/minerals/Y.png", score: 65, frequency: 0.025 },
            { name: "Гадолиний", symbol: "Gd", imageSrc: "/minerals/Gd.png", score: 70, frequency: 0.02 },
            { name: "Тербий", symbol: "Tb", imageSrc: "/minerals/Tb.png", score: 75, frequency: 0.015 },
            { name: "Лютеций", symbol: "Lu", imageSrc: "/minerals/Lu.png", score: 80, frequency: 0.01 }
        ]
    },
    {
        order: 12,
        name: "Супер-редкие",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level12_video.mp4",
        requiredScore: 11000,
        duration: 120,
        colorScheme: { primary: "#F44336", secondary: "#E57373" },
        minerals: [
            { name: "Иридий", symbol: "Ir", imageSrc: "/minerals/Ir.png", score: 150, frequency: 0.005 },
            { name: "Осмий", symbol: "Os", imageSrc: "/minerals/Os.png", score: 140, frequency: 0.006 },
            { name: "Родий", symbol: "Rh", imageSrc: "/minerals/Rh.png", score: 130, frequency: 0.007 },
            { name: "Палладий", symbol: "Pd", imageSrc: "/minerals/Pd.png", score: 100, frequency: 0.008 },
            { name: "Рений", symbol: "Re", imageSrc: "/minerals/Re.png", score: 120, frequency: 0.009 }
        ]
    },
    {
        order: 13,
        name: "Все элементы!",
        backgroundUrl: "/game/backgrounds/level1.jpg",
        backgroundVideo: "/game/backgrounds/videos/level13_video.mp4",
        requiredScore: 12000,
        duration: 180,
        colorScheme: { primary: "#3F51B5", secondary: "#7986CB" },
        minerals: [ // A mix of various valuable/common/representative minerals
            { name: "Золото", symbol: "Au", imageSrc: "/minerals/Au.png", score: 100, frequency: 0.01 },
            { name: "Платина", symbol: "Pt", imageSrc: "/minerals/Pt.png", score: 120, frequency: 0.008 },
            { name: "Углерод", symbol: "C", imageSrc: "/minerals/C.png", score: 20, frequency: 0.05 }, // Diamond form
            { name: "Титан", symbol: "Ti", imageSrc: "/minerals/Ti.png", score: 40, frequency: 0.04 },
            { name: "Неон", symbol: "Ne", imageSrc: "/minerals/Ne.png", score: 40, frequency: 0.03 },
            { name: "Литий", symbol: "Li", imageSrc: "/minerals/Li.png", score: 20, frequency: 0.06 },
            { name: "Уран", symbol: "U", imageSrc: "/minerals/U.png", score: 80, frequency: 0.005 },
            { name: "Железо", symbol: "Fe", imageSrc: "/minerals/Fe.png", score: 15, frequency: 0.07 }
        ]
    }
];

module.exports = levels; 