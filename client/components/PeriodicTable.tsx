import * as React from 'react';
import { MINERALS, MineralInfo } from '../game/constants/minerals';

interface PeriodicTableProps {
  collectedMinerals: string[]; // массив символов собранных элементов
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ collectedMinerals }: PeriodicTableProps) => {
  // Определяем максимальный период
  const maxPeriod: number = Math.max(...MINERALS.map((m: MineralInfo) => m.period));
  const periods: number[] = Array.from({ length: maxPeriod }, (_, i) => i + 1);

  return (
    <div className="p-4 overflow-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-white">Периодическая таблица</h1>
        <p className="text-sm text-gray-300">Собранные элементы: {collectedMinerals.length} из {MINERALS.length}</p>
      </div>
      {/* 18 колонок по стандарту таблицы Менделеева */}
      <div className="grid grid-cols-18 gap-1">
        {periods.map((period: number) => (
          <div key={period} className="flex gap-1">
            {MINERALS.filter((m: MineralInfo) => m.period === period).sort((a: MineralInfo, b: MineralInfo) => a.atomicNumber - b.atomicNumber).map((mineral: MineralInfo) => {
              const isCollected = collectedMinerals.includes(mineral.symbol);
              return (
                <div
                  key={mineral.symbol}
                  className={`
                    relative w-16 h-16 rounded-lg p-1
                    ${isCollected ? 'bg-accent' : 'bg-neutral'}
                    transition-all duration-300
                    hover:scale-105 cursor-pointer
                  `}
                >
                  <div className="text-xs text-center">
                    <div className="font-bold">{mineral.symbol}</div>
                    <div className="text-[8px]">{mineral.name}</div>
                    <div className="text-[8px]">{mineral.atomicNumber}</div>
                  </div>
                  {isCollected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-accent rounded-full opacity-50 animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeriodicTable; 