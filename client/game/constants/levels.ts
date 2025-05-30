import { MineralInfo, MINERALS } from "./minerals";

export interface LevelConfig {
  id: number;
  name: string;
  background: string;
  minerals: string[]; // массив символов элементов
  spawnInterval: number;
  minSpeed: number;
  maxSpeed: number;
  duration: number;
  special?: string;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Базовый уровень",
    background: "#181818",
    minerals: ["H", "He", "Li", "Be"],
    spawnInterval: 200,
    minSpeed: 100,
    maxSpeed: 400,
    duration: 20,
    special: "Стандартная скорость и минералы."
  },
  {
    id: 2,
    name: "Щелочные металлы",
    background: "#1a1a2e",
    minerals: ["Li", "Na", "K", "Rb", "Cs", "Fr"],
    spawnInterval: 180,
    minSpeed: 120,
    maxSpeed: 420,
    duration: 22,
    special: "Появляются только щелочные металлы."
  },
  {
    id: 3,
    name: "Галогены и благородные газы",
    background: "#22223b",
    minerals: ["F", "Cl", "Br", "I", "At", "Ts", "He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og"],
    spawnInterval: 170,
    minSpeed: 130,
    maxSpeed: 430,
    duration: 24,
    special: "Редкие элементы встречаются чаще."
  },
  {
    id: 4,
    name: "Переходные металлы",
    background: "#2d3142",
    minerals: ["Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn"],
    spawnInterval: 160,
    minSpeed: 140,
    maxSpeed: 440,
    duration: 26,
    special: "Много металлов, скорость выше."
  },
  {
    id: 5,
    name: "Лантаноиды",
    background: "#3a506b",
    minerals: ["La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
    spawnInterval: 150,
    minSpeed: 150,
    maxSpeed: 450,
    duration: 28,
    special: "Выпадают только лантаноиды."
  },
  {
    id: 6,
    name: "Актиноиды",
    background: "#1b263b",
    minerals: ["Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"],
    spawnInterval: 140,
    minSpeed: 160,
    maxSpeed: 460,
    duration: 30,
    special: "Выпадают только актиноиды."
  },
  {
    id: 7,
    name: "Главная группа",
    background: "#0b132b",
    minerals: ["B", "C", "N", "O", "F", "Si", "P", "S", "Cl", "As", "Se", "Br", "Sb", "Te", "I", "At"],
    spawnInterval: 130,
    minSpeed: 170,
    maxSpeed: 470,
    duration: 32,
    special: "Только элементы главной группы."
  },
  {
    id: 8,
    name: "Щелочноземельные металлы",
    background: "#5f4bb6",
    minerals: ["Be", "Mg", "Ca", "Sr", "Ba", "Ra"],
    spawnInterval: 120,
    minSpeed: 180,
    maxSpeed: 480,
    duration: 34,
    special: "Щелочноземельные металлы, высокая скорость."
  },
  {
    id: 9,
    name: "Постпереходные металлы",
    background: "#6a0572",
    minerals: ["Al", "Ga", "In", "Sn", "Tl", "Pb", "Bi", "Nh", "Fl", "Mc", "Lv"],
    spawnInterval: 110,
    minSpeed: 190,
    maxSpeed: 490,
    duration: 36,
    special: "Редкие постпереходные металлы."
  },
  {
    id: 10,
    name: "Смешанный уровень",
    background: "#ff6f3c",
    minerals: ["H", "O", "Na", "K", "Fe", "Cu", "Ag", "Au", "Pb", "U"],
    spawnInterval: 100,
    minSpeed: 200,
    maxSpeed: 500,
    duration: 38,
    special: "Смешанные элементы, высокая сложность."
  },
  {
    id: 11,
    name: "Редкоземельные элементы",
    background: "#2e294e",
    minerals: ["Sc", "Y", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
    spawnInterval: 90,
    minSpeed: 210,
    maxSpeed: 510,
    duration: 40,
    special: "Редкоземельные элементы, максимальная скорость."
  },
  {
    id: 12,
    name: "Супер-редкие",
    background: "#ff206e",
    minerals: ["Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
    spawnInterval: 80,
    minSpeed: 220,
    maxSpeed: 520,
    duration: 42,
    special: "Выпадают только сверхтяжёлые элементы."
  },
  {
    id: 13,
    name: "Все элементы!",
    background: "#00b894",
    minerals: MINERALS.map(m => m.symbol),
    spawnInterval: 70,
    minSpeed: 230,
    maxSpeed: 530,
    duration: 45,
    special: "Финальный уровень: все 118 элементов!"
  }
]; 