import React from 'react';
import { MINERALS } from '../game/constants/minerals';

interface PeriodicTableProps {
  collectedMinerals: string[]; // массив символов собранных элементов
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ collectedMinerals }) => {
  // Группируем элементы по периодам
  const periods = Array.from({ length: 7 }, (_, i) => i + 1);
  
  return (
    <div className="p-4 overflow-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-white">Периодическая таблица</h1>
        <p className="text-sm text-gray-300">Собранные элементы: {collectedMinerals.length} из {MINERALS.length}</p>
      </div>
      
      <div className="grid grid-cols-18 gap-1">
        {periods.map((period) => (
          <div key={period} className="flex gap-1">
            {MINERALS.filter(m => m.period === period).map((mineral) => {
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