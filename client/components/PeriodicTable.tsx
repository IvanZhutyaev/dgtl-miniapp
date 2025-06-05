import * as React from 'react';
import { MINERALS, MineralInfo } from '../game/constants/minerals';
import { useEffect, useState, useMemo } from 'react';

interface PeriodicTableProps {
  collectedMinerals: string[]; // Array of symbols of collected minerals
}

// Helper to get group and adjust for Lanthanides/Actinides
const getElementVisualPlacement = (atomicNumber: number, period: number) => {
  if (atomicNumber >= 57 && atomicNumber <= 71) { // Lanthanides
    return { period: 8, group: atomicNumber - 57 + 3 }; // Display in a separate row, group starts from 3 for display
  }
  if (atomicNumber >= 89 && atomicNumber <= 103) { // Actinides
    return { period: 9, group: atomicNumber - 89 + 3 }; // Display in a separate row, group starts from 3 for display
  }

  let group = 0;
  if (period === 1) {
    group = (atomicNumber === 1) ? 1 : 18;
  } else if (period === 2 || period === 3) {
    if (atomicNumber >= 3 && atomicNumber <= 4) group = atomicNumber - 2;
    else if (atomicNumber >= 5 && atomicNumber <= 10) group = atomicNumber - (period === 2 ? 4 : 4) + 12; 
    else if (atomicNumber >= 11 && atomicNumber <= 12) group = atomicNumber - 10;
    else if (atomicNumber >= 13 && atomicNumber <= 18) group = atomicNumber - 10 + 10;
  } else if (period === 4 || period === 5) {
     if (atomicNumber >=19 && atomicNumber <=20) group = atomicNumber -18;
     else if (atomicNumber >=21 && atomicNumber <=30) group = atomicNumber -18;
     else if (atomicNumber >=31 && atomicNumber <=36) group = atomicNumber -18 + 10;
     if (period === 5) {
        if (atomicNumber >=37 && atomicNumber <=38) group = atomicNumber - 36;
        else if (atomicNumber >=39 && atomicNumber <=48) group = atomicNumber - 36;
        else if (atomicNumber >=49 && atomicNumber <=54) group = atomicNumber - 36 + 10;
     }
  } else if (period === 6 || period === 7) {
    if (atomicNumber === 55 || atomicNumber === 56 || atomicNumber === 87 || atomicNumber === 88) {
        group = (atomicNumber === 55 || atomicNumber === 87) ? 1: 2;
    } else if (atomicNumber >= 72 && atomicNumber <= 80) group = atomicNumber - 72 + 4;
    else if (atomicNumber >= 81 && atomicNumber <= 86) group = atomicNumber - 81 + 13;
    else if (atomicNumber >= 104 && atomicNumber <= 112) group = atomicNumber - 104 + 4;
    else if (atomicNumber >= 113 && atomicNumber <= 118) group = atomicNumber - 113 + 13;
  }
  if (group === 0 && atomicNumber === 1) group = 1;
  if (group === 0 && atomicNumber === 2) group = 18;
  if (group === 0 && atomicNumber === 3) group = 1;
  if (group === 0 && atomicNumber === 4) group = 2;
  if (group === 0 && atomicNumber >= 5 && atomicNumber <=10 ) group = atomicNumber - 4 + 12;
  if (group === 0 && atomicNumber >= 13 && atomicNumber <=18 ) group = atomicNumber - 10 +10 + (period === 2? 0:0);
  return { period, group };
};

const PeriodicTable: React.FC<PeriodicTableProps> = ({ collectedMinerals }) => {
  const allMineralsSorted = useMemo(() => 
    MINERALS.slice().sort((a, b) => a.atomicNumber - b.atomicNumber)
  , []);

  const [tableRows, setTableRows] = useState<(MineralInfo | null)[][]>([]);
  const [lanthanideRow, setLanthanideRow] = useState<(MineralInfo | null)[]>([]);
  const [actinideRow, setActinideRow] = useState<(MineralInfo | null)[]>([]);

  useEffect(() => {
    const newTableRows: (MineralInfo | null)[][] = Array(7).fill(null).map(() => Array(18).fill(null));
    const newLanthanideRow: (MineralInfo | null)[] = Array(15).fill(null);
    const newActinideRow: (MineralInfo | null)[] = Array(15).fill(null);

    allMineralsSorted.forEach(mineral => {
      const { period: visualPeriod, group: visualGroup } = getElementVisualPlacement(mineral.atomicNumber, mineral.period);
      
      if (visualPeriod >= 1 && visualPeriod <= 7) { // Main table
        if (newTableRows[visualPeriod - 1] && visualGroup > 0 && visualGroup <= 18) {
          newTableRows[visualPeriod - 1][visualGroup - 1] = mineral;
        }
      } else if (visualPeriod === 8) { // Lanthanides row
        if (visualGroup > 0 && visualGroup <= 15) { // Groups 3-17 for Lanthanides (15 elements)
          newLanthanideRow[visualGroup - 1] = mineral;
        }
      } else if (visualPeriod === 9) { // Actinides row
         if (visualGroup > 0 && visualGroup <= 15) { // Groups 3-17 for Actinides (15 elements)
          newActinideRow[visualGroup - 1] = mineral;
        }
      }
    });
    setTableRows(newTableRows);
    setLanthanideRow(newLanthanideRow);
    setActinideRow(newActinideRow);

  }, [allMineralsSorted]);

  const renderCell = (mineral: MineralInfo | null, rowIndex: number, cellIndex: number, type: 'main' | 'lanthanide' | 'actinide') => {
    const key = mineral ? mineral.symbol : `empty-${type}-${rowIndex}-${cellIndex}`;
    if (!mineral) {
      // Render placeholder for specific cells (e.g., Lanthanide/Actinide markers in main table)
      if (type === 'main') {
        if (rowIndex === 5 && cellIndex === 2) { // Placeholder for Lanthanides
          return <div key={key} className="w-full h-full min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center text-xs text-gray-400">57-71</div>;
        }
        if (rowIndex === 6 && cellIndex === 2) { // Placeholder for Actinides
          return <div key={key} className="w-full h-full min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center text-xs text-gray-400">89-103</div>;
        }
      }
      return <div key={key} className="w-full h-full min-h-[2.5rem] md:min-h-[3rem]" />; // Empty cell
    }

    const isCollected = collectedMinerals.includes(mineral.symbol);
    // Basic color styling, can be expanded based on mineral.category or other properties
    const bgColor = isCollected ? 'bg-success' : (((mineral.atomicNumber >= 57 && mineral.atomicNumber <= 71) || (mineral.atomicNumber >= 89 && mineral.atomicNumber <= 103)) ? 'bg-accent' : 'bg-info');
    const textColor = 'text-white';

    return (
      <div
        key={key}
        className={`w-full h-full min-h-[2.5rem] md:min-h-[3rem] flex flex-col items-center justify-center rounded p-0.5 ${bgColor} ${textColor} transition-all duration-300`}
      >
        <div className="text-xs sm:text-sm font-bold">{mineral.symbol}</div>
        <div className="text-[0.5rem] sm:text-xs opacity-80">{mineral.atomicNumber}</div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 bg-neutral text-white min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-4 text-accent">Периодическая таблица</h1>
      <p className="text-xs sm:text-sm text-gray-300 text-center mb-3 sm:mb-6">
        Собрано элементов: {collectedMinerals.length} из {MINERALS.length}
      </p>

      {/* Main Table */}
      <div className="grid grid-cols-18 gap-0.5 sm:gap-1 bg-secondary p-0.5 sm:p-1 rounded-md">
        {tableRows.map((row, rowIndex) =>
          row.map((mineral, cellIndex) => renderCell(mineral, rowIndex, cellIndex, 'main'))
        )}
      </div>

      {/* Lanthanides Row */}
      <div className="mt-3 sm:mt-4">
        <h2 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-300">Лантаноиды:</h2>
        <div className="grid grid-cols-15 gap-0.5 sm:gap-1 bg-secondary p-0.5 sm:p-1 rounded-md">
          {lanthanideRow.map((mineral, cellIndex) => renderCell(mineral, 0, cellIndex, 'lanthanide'))}
        </div>
      </div>

      {/* Actinides Row */}
      <div className="mt-3 sm:mt-4">
        <h2 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-300">Актиноиды:</h2>
        <div className="grid grid-cols-15 gap-0.5 sm:gap-1 bg-secondary p-0.5 sm:p-1 rounded-md">
          {actinideRow.map((mineral, cellIndex) => renderCell(mineral, 0, cellIndex, 'actinide'))}
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable; 