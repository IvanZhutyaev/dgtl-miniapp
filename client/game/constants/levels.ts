import { MineralInfo, MINERALS } from "./minerals";

export interface LevelConfig {
  id: number;
  name: string;
  background: string;
  backgroundImage: string;
  backgroundVideo?: string;
  minerals: string[]; // массив символов элементов
  spawnInterval: number;
  minSpeed: number;
  maxSpeed: number;
  duration: number;
  special?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const LEVEL_1_BACKGROUND_IMAGE = "/game/backgrounds/level1.jpg";
const LEVEL_2_BACKGROUND_IMAGE = "/game/backgrounds/level2.jpg";


// const LEVEL_1_BACKGROUND_VIDEO = "/game/backgrounds/videos/level1_video.mp4"; // Keep if you want to also set video for all

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Базовый уровень",
    background: "#181818",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    // backgroundVideo: "/game/backgrounds/videos/level1_video.mp4",
    minerals: ["H", "He", "Li", "Be"],
    spawnInterval: 200,
    minSpeed: 100,
    maxSpeed: 400,
    duration: 20,
    special: "Стандартная скорость и минералы.",
    colorScheme: {
      primary: "#181818",
      secondary: "#2a2a2a",
      accent: "#39ff14"
    }
  },
  {
    id: 2,
    name: "Щелочные металлы",
    background: "#1a1a2e",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    minerals: ["Li", "Na", "K", "Rb", "Cs", "Fr"],
    spawnInterval: 180,
    minSpeed: 120,
    maxSpeed: 420,
    duration: 22,
    special: "Появляются только щелочные металлы.",
    colorScheme: {
      primary: "#1a1a2e",
      secondary: "#2d2d4a",
      accent: "#ff007f"
    }
  },
  {
    id: 3,
    name: "Галогены и благородные газы",
    background: "#22223b",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    minerals: ["F", "Cl", "Br", "I", "At", "Ts", "He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og"],
    spawnInterval: 170,
    minSpeed: 130,
    maxSpeed: 430,
    duration: 24,
    special: "Редкие элементы встречаются чаще.",
    colorScheme: {
      primary: "#22223b",
      secondary: "#3a3a5a",
      accent: "#00ffff"
    }
  },
  {
    id: 4,
    name: "Переходные металлы",
    background: "#2d3142",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    minerals: ["Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn"],
    spawnInterval: 160,
    minSpeed: 140,
    maxSpeed: 440,
    duration: 26,
    special: "Много металлов, скорость выше.",
    colorScheme: {
      primary: "#2d3142",
      secondary: "#4a4d6a",
      accent: "#ffea00"
    }
  },
  {
    id: 5,
    name: "Лантаноиды",
    background: "#3a506b",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    minerals: ["La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
    spawnInterval: 150,
    minSpeed: 150,
    maxSpeed: 450,
    duration: 28,
    special: "Выпадают только лантаноиды.",
    colorScheme: {
      primary: "#3a506b",
      secondary: "#5a709b",
      accent: "#00ff00"
    }
  },
  {
    id: 6,
    name: "Актиноиды",
    background: "#1b263b",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    minerals: ["Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"],
    spawnInterval: 140,
    minSpeed: 160,
    maxSpeed: 460,
    duration: 30,
    special: "Выпадают только актиноиды.",
    colorScheme: {
      primary: "#1b263b",
      secondary: "#2b365b",
      accent: "#ff0033"
    }
  },
  {
    id: 7,
    name: "Главная группа",
    background: "#0b132b",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    minerals: ["B", "C", "N", "O", "F", "Si", "P", "S", "Cl", "As", "Se", "Br", "Sb", "Te", "I", "At"],
    spawnInterval: 130,
    minSpeed: 170,
    maxSpeed: 470,
    duration: 32,
    special: "Только элементы главной группы.",
    colorScheme: {
      primary: "#0b132b",
      secondary: "#1b234b",
      accent: "#00c0ff"
    }
  },
  {
    id: 8,
    name: "Щелочноземельные металлы",
    background: "#5f4bb6",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    minerals: ["Be", "Mg", "Ca", "Sr", "Ba", "Ra"],
    spawnInterval: 120,
    minSpeed: 180,
    maxSpeed: 480,
    duration: 34,
    special: "Щелочноземельные металлы, высокая скорость.",
    colorScheme: {
      primary: "#5f4bb6",
      secondary: "#7f6bd6",
      accent: "#ff007f"
    }
  },
  {
    id: 9,
    name: "Постпереходные металлы",
    background: "#6a0572",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    minerals: ["Al", "Ga", "In", "Sn", "Tl", "Pb", "Bi", "Nh", "Fl", "Mc", "Lv"],
    spawnInterval: 110,
    minSpeed: 190,
    maxSpeed: 490,
    duration: 36,
    special: "Редкие постпереходные металлы.",
    colorScheme: {
      primary: "#6a0572",
      secondary: "#8a2592",
      accent: "#00ffff"
    }
  },
  {
    id: 10,
    name: "Смешанный уровень",
    background: "#ff6f3c",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    minerals: ["H", "O", "Na", "K", "Fe", "Cu", "Ag", "Au", "Pb", "U"],
    spawnInterval: 100,
    minSpeed: 200,
    maxSpeed: 500,
    duration: 38,
    special: "Смешанные элементы, высокая сложность.",
    colorScheme: {
      primary: "#ff6f3c",
      secondary: "#ff8f5c",
      accent: "#ffea00"
    }
  },
  {
    id: 11,
    name: "Редкоземельные элементы",
    background: "#2e294e",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    minerals: ["Sc", "Y", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
    spawnInterval: 90,
    minSpeed: 210,
    maxSpeed: 510,
    duration: 40,
    special: "Редкоземельные элементы, максимальная скорость.",
    colorScheme: {
      primary: "#2e294e",
      secondary: "#4e496e",
      accent: "#00ff00"
    }
  },
  {
    id: 12,
    name: "Супер-редкие",
    background: "#ff206e",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    minerals: ["Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
    spawnInterval: 80,
    minSpeed: 220,
    maxSpeed: 520,
    duration: 42,
    special: "Выпадают только сверхтяжёлые элементы.",
    colorScheme: {
      primary: "#ff206e",
      secondary: "#ff408e",
      accent: "#ff0033"
    }
  },
  {
    id: 13,
    name: "Все элементы!",
    background: "#00b894",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    minerals: MINERALS.map(m => m.symbol),
    spawnInterval: 70,
    minSpeed: 230,
    maxSpeed: 530,
    duration: 45,
    special: "Финальный уровень: все 118 элементов!",
    colorScheme: {
      primary: "#00b894",
      secondary: "#20d8b4",
      accent: "#ffea00"
    }
  }
]; 