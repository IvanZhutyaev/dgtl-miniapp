import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { MINERALS, MineralInfo } from '../game/constants/minerals'; // Adjusted path
import Layout from '../components/layout'; // Corrected import: default and lowercase path
import { useSession } from 'next-auth/react'; // <-- Импорт useSession
import axios from 'axios'; // <-- Импорт axios

// Helper to get group for an element (simplified)
// A more accurate mapping might be needed for a perfect periodic table
const getGroup = (atomicNumber: number): number => {
  if (atomicNumber === 1) return 1; // H
  if (atomicNumber === 2) return 18; // He
  // Lanthanides and Actinides are typically handled separately or placed in group 3
  if (atomicNumber >= 57 && atomicNumber <= 71) return 3; // Lanthanides
  if (atomicNumber >= 89 && atomicNumber <= 103) return 3; // Actinides
  
  const period = MINERALS.find(m => m.atomicNumber === atomicNumber)?.period;
  if (!period) return 0;

  if (period === 2 || period === 3) {
    if (atomicNumber >= 3 && atomicNumber <= 4) return atomicNumber - 2; // Li, Be
    if (atomicNumber >= 5 && atomicNumber <= 10) return atomicNumber - 4 + 12; // B-Ne (map to 13-18)
  }
  if (period === 4 || period === 5) {
    if (atomicNumber >= 19 && atomicNumber <= 20) return atomicNumber - 18; // K, Ca
    if (atomicNumber >= 21 && atomicNumber <= 30) return atomicNumber - 18; // Sc-Zn
    if (atomicNumber >= 31 && atomicNumber <= 36) return atomicNumber - 20 + 12; // Ga-Kr
  }
   if (period === 6 || period === 7) {
    if (atomicNumber >= 55 && atomicNumber <= 56) return atomicNumber - 54; // Cs, Ba
    // Lanthanides/Actinides already handled
    if (atomicNumber >= 72 && atomicNumber <= 80) return atomicNumber - 54 - 14; // Hf-Hg (group 4-12 after Lanthanides)
    if (atomicNumber >= 81 && atomicNumber <= 86) return atomicNumber - 54 - 14 - 10 + 12; // Tl-Rn
    if (atomicNumber >= 104 && atomicNumber <= 112) return atomicNumber - 86 - 14; // Rf-Cn (group 4-12 after Actinides)
    if (atomicNumber >= 113 && atomicNumber <= 118) return atomicNumber - 86 - 14 - 10 + 12; // Nh-Og
  }
  // Fallback for simple cases if above logic is incomplete for some elements
  const sBlock = [1, 3, 11, 19, 37, 55, 87];
  const pBlockStart = [5, 13, 31, 49, 81, 113];
  if (sBlock.includes(atomicNumber) || sBlock.map(n => n + 1).includes(atomicNumber)) {
    return (atomicNumber === 1 || atomicNumber === 2) ? (atomicNumber === 1 ? 1 : 18) : ((atomicNumber - sBlock.filter(n => n < atomicNumber).pop()!) % 2) + 1;
  }
  // This is a very rough group calculation, a proper mapping array or more complex logic is better.
  // For now, let's try to place them approximately.
  return (atomicNumber % 18) || 18;
};

// Helper to get group and period for an element (может потребовать доработки для точности)
const getElementVisualPlacement = (atomicNumber: number, allMineralsSorted: MineralInfo[]): { group: number; period: number; isLanthanide: boolean; isActinide: boolean } => {
  const mineral = allMineralsSorted.find(m => m.atomicNumber === atomicNumber);
  if (!mineral) return { group: 0, period: 0, isLanthanide: false, isActinide: false };

  const period = mineral.period;
  let group = 0;
  const isLanthanide = atomicNumber >= 57 && atomicNumber <= 71;
  const isActinide = atomicNumber >= 89 && atomicNumber <= 103;

  if (isLanthanide || isActinide) {
    group = 3; // Традиционно помещаются в группу 3
  } else if (period === 1) {
    group = (atomicNumber === 1) ? 1 : 18;
  } else if (period === 2 || period === 3) {
    if (atomicNumber >= 3 && atomicNumber <= 4) group = atomicNumber - (period === 2 ? 2 : 10); // Li,Be | Na,Mg -> 1,2
    else if (atomicNumber >= 5 && atomicNumber <= 10) group = atomicNumber - (period === 2 ? 4 : 12) + 12; // B-Ne | Al-Ar -> 13-18 (скорректировано)
    else if (atomicNumber >= 13 && atomicNumber <= 18) group = atomicNumber - 12 + 12; // Al-Ar map to 13-18

  } else if (period === 4 || period === 5) {
    if (atomicNumber >= 19 && atomicNumber <= 20) group = atomicNumber - (period === 4 ? 18 : 36); // K,Ca | Rb,Sr -> 1,2
    else if (atomicNumber >= 37 && atomicNumber <= 38) group = atomicNumber - 36;
    else if (atomicNumber >= 21 && atomicNumber <= 30) group = atomicNumber - (period === 4 ? 18 : 36); // Sc-Zn | Y-Cd -> 3-12
    else if (atomicNumber >= 39 && atomicNumber <= 48) group = atomicNumber - 36;
    else if (atomicNumber >= 31 && atomicNumber <= 36) group = atomicNumber - (period === 4 ? 20 : 38) + 12; // Ga-Kr | In-Xe -> 13-18
    else if (atomicNumber >= 49 && atomicNumber <= 54) group = atomicNumber - 38 + 12;

  } else if (period === 6 || period === 7) {
    if (atomicNumber >= 55 && atomicNumber <= 56) group = atomicNumber - (period === 6 ? 54 : 86); // Cs,Ba | Fr,Ra -> 1,2
    else if (atomicNumber >= 87 && atomicNumber <= 88) group = atomicNumber - 86;
    // Лантаноиды/Актиноиды уже обработаны
    else if (atomicNumber >= 72 && atomicNumber <= 80) group = atomicNumber - (period === 6 ? 54 : 86) - 14; // Hf-Hg | Rf-Cn -> 4-12 (после лантаноидов/актиноидов)
    else if (atomicNumber >= 104 && atomicNumber <= 112) group = atomicNumber - 86 - 14;
    else if (atomicNumber >= 81 && atomicNumber <= 86) group = atomicNumber - (period === 6 ? 54 : 86) - 14 - 10 + 12; // Tl-Rn | Nh-Og -> 13-18
    else if (atomicNumber >= 113 && atomicNumber <= 118) group = atomicNumber - 86 - 14 - 10 + 12;
  }
  return { group, period, isLanthanide, isActinide };
};

interface CollectedMineralData {
  count: number;
  // any other data you store per collected mineral
}

interface PlayerCollectedMinerals {
  [mineralSymbol: string]: CollectedMineralData;
}

const CollectionPage: React.FC = () => {
  const { data: session } = useSession();
  const [collected, setCollected] = useState<PlayerCollectedMinerals>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectedMinerals = async () => {
      if (!session?.user?.telegramId) {
        setIsLoading(false); // Нет сессии, нечего загружать для этого пользователя
        // Можно установить setCollected({}), но он уже такой по умолчанию
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/user/data');
        if (response.data && response.data.collectedMinerals) {
          const rawMinerals = response.data.collectedMinerals as Record<string, number>; // e.g. { Au: 5, Fe: 10 }
          const formattedMinerals: PlayerCollectedMinerals = {};
          for (const symbol in rawMinerals) {
            formattedMinerals[symbol] = { count: rawMinerals[symbol] };
          }
          setCollected(formattedMinerals);
        } else {
          setCollected({}); // На случай, если поле отсутствует, но запрос успешен
        }
      } catch (err) {
        console.error("Error fetching collected minerals:", err);
        setError('Failed to load mineral collection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectedMinerals();
  }, [session]);

  const allMineralsSorted = [...MINERALS].sort((a, b) => a.atomicNumber - b.atomicNumber);
  
  const tableRows = Array(7).fill(null).map(() => Array(18).fill(null) as (MineralInfo | null)[]);
  const lanthanideRow: (MineralInfo | null)[] = Array(15).fill(null);
  const actinideRow: (MineralInfo | null)[] = Array(15).fill(null);

  allMineralsSorted.forEach(mineral => {
    const { group, period, isLanthanide, isActinide } = getElementVisualPlacement(mineral.atomicNumber, allMineralsSorted);
    if (isLanthanide) {
      lanthanideRow[mineral.atomicNumber - 57] = mineral;
    } else if (isActinide) {
      actinideRow[mineral.atomicNumber - 89] = mineral;
    } else {
      if (period > 0 && period <= 7 && group > 0 && group <= 18) {
        tableRows[period - 1][group - 1] = mineral;
      }
    }
  });
  
  // Placeholder for Lanthanide/Actinide series indicators
  if (tableRows[5] && tableRows[5][2]) { // Element 57 (La) spot
     // tableRows[5][2] = { name: 'Lanthanides', symbol: 'La-Lu', atomicNumber: 57-71, image:'', points:0, period: 6  }; // Special marker
  }
   if (tableRows[6] && tableRows[6][2]) { // Element 89 (Ac) spot
     // tableRows[6][2] = { name: 'Actinides', symbol: 'Ac-Lr', atomicNumber: 89-103, image:'', points:0, period: 7 }; // Special marker
  }

  if (isLoading) {
    return <Layout><div className="container mx-auto p-4 text-center">Loading mineral collection...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div></Layout>;
  }

  return (
    <Layout>
      <Head>
        <title>My Mineral Collection | DGTL P2E Game</title>
      </Head>
      <div className="container mx-auto p-4 pb-24">
        <h1 className="text-3xl font-bold text-center mb-8">My Mineral Collection</h1>
        
        <p className="text-center mb-4">
          Displaying {Object.keys(collected).length} out of {MINERALS.length} unique collected mineral types.
        </p>

        <div className="periodic-table-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gap: '2px' }}>
          {tableRows.flat().map((mineral, index) => {
            const cellKey = mineral ? `main-${mineral.symbol}` : `empty-main-${index}`;
            if (mineral && mineral.atomicNumber === 57 && tableRows[5][2]) { 
                 return (
                    <div key={'placeholder-la-series'} className="border p-1 text-xs text-center bg-gray-200 aspect-square flex flex-col items-center justify-center rounded">
                       <span className="font-semibold">57-71</span>
                       <span className="text-sm">*</span>
                    </div>
                );
            }
            if (mineral && mineral.atomicNumber === 89 && tableRows[6][2]) { 
                 return (
                    <div key={'placeholder-ac-series'} className="border p-1 text-xs text-center bg-gray-200 aspect-square flex flex-col items-center justify-center rounded">
                       <span className="font-semibold">89-103</span>
                       <span className="text-sm">**</span>
                    </div>
                );
            }

            let cellClassName = "border p-1 text-xs text-center aspect-square flex flex-col items-center justify-center rounded transition-all duration-150 ease-in-out";
            const isCollected = mineral && collected[mineral.symbol];
            const collectionData = mineral ? collected[mineral.symbol] : undefined;

            if (mineral) {
                cellClassName += ` cursor-pointer hover:shadow-lg ${isCollected ? 'bg-green-200 border-green-500 hover:bg-green-300' : 'bg-gray-100 hover:bg-gray-200'}`;
                // Скрываем реальные элементы лантаноидов/актиноидов из основной таблицы, если они размещаются в отдельных рядах
                // const { isLanthanide, isActinide } = getElementVisualPlacement(mineral.atomicNumber, allMineralsSorted);
                // if (isLanthanide || isActinide) {
                //     cellClassName += ' opacity-0 pointer-events-none'; 
                // }
            } else {
                cellClassName += ' bg-white opacity-30'; // Пустые ячейки
            }

            return (
              <div
                key={cellKey}
                className={cellClassName}
                title={mineral ? `${mineral.name} (${mineral.symbol}) - ${isCollected ? 'Collected: ' + collectionData?.count : 'Not Collected'}` : 'Empty'}
              >
                {mineral ? (
                  <>
                    <div className="font-mono text-sm font-semibold">{mineral.atomicNumber}</div>
                    <div className="font-bold text-lg">{mineral.symbol}</div>
                    <div className="text-xs truncate w-full px-1">{mineral.name}</div>
                    {isCollected && <div className="text-xs font-bold mt-0.5">x{collectionData?.count}</div>}
                  </>
                ) : (
                  <span>&nbsp;</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Lanthanides Row */}
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-1 text-left"><span className="text-sm">*</span> Lanthanides</h2>
            <div className="lanthanide-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(15, minmax(0, 1fr))', gap: '2px' }}>
                {lanthanideRow.map((mineral, index) => {
                     const cellKey = mineral ? `lantha-${mineral.symbol}` : `empty-lantha-${index}`;
                     const isCollected = mineral && collected[mineral.symbol];
                     const collectionData = mineral ? collected[mineral.symbol] : undefined;
                     let cellClassName = "border p-1 text-xs text-center aspect-square flex flex-col items-center justify-center rounded transition-all duration-150 ease-in-out";
                     if (mineral) {
                        cellClassName += ` cursor-pointer hover:shadow-lg ${isCollected ? 'bg-yellow-200 border-yellow-500 hover:bg-yellow-300' : 'bg-gray-100 hover:bg-gray-200'}`;
                     } else {
                        // Пустые ячейки в ряду лантаноидов/актиноидов можно сделать менее заметными или убрать
                        // cellClassName += ' bg-gray-50 opacity-0 pointer-events-none';
                        return <div key={cellKey} className="aspect-square"></div>; // Просто пустое место
                     }
                    return (
                        <div
                        key={cellKey}
                        className={cellClassName}
                        title={mineral ? `${mineral.name} (${mineral.symbol}) - ${isCollected ? 'Collected: ' + collectionData?.count : 'Not Collected'}` : 'Empty'}
                        >
                        {mineral ? (
                            <>
                            <div className="font-mono text-sm font-semibold">{mineral.atomicNumber}</div>
                            <div className="font-bold text-lg">{mineral.symbol}</div>
                            <div className="text-xs truncate w-full px-1">{mineral.name}</div>
                            {isCollected && <div className="text-xs font-bold mt-0.5">x{collectionData?.count}</div>}
                            </>
                        ) : (
                            <span>&nbsp;</span>
                        )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Actinides Row */}
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-1 text-left"><span className="text-sm">**</span> Actinides</h2>
             <div className="actinide-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(15, minmax(0, 1fr))', gap: '2px' }}>
                {actinideRow.map((mineral, index) => {
                    const cellKey = mineral ? `act-${mineral.symbol}` : `empty-act-${index}`;
                    const isCollected = mineral && collected[mineral.symbol];
                    const collectionData = mineral ? collected[mineral.symbol] : undefined;
                    let cellClassName = "border p-1 text-xs text-center aspect-square flex flex-col items-center justify-center rounded transition-all duration-150 ease-in-out";
                    if (mineral) {
                        cellClassName += ` cursor-pointer hover:shadow-lg ${isCollected ? 'bg-purple-200 border-purple-500 hover:bg-purple-300' : 'bg-gray-100 hover:bg-gray-200'}`;
                    } else {
                        // cellClassName += ' bg-gray-50 opacity-0 pointer-events-none';
                        return <div key={cellKey} className="aspect-square"></div>; // Просто пустое место
                    }
                    return (
                        <div
                        key={cellKey}
                        className={cellClassName}
                        title={mineral ? `${mineral.name} (${mineral.symbol}) - ${isCollected ? 'Collected: ' + collectionData?.count : 'Not Collected'}` : 'Empty'}
                        >
                        {mineral ? (
                            <>
                            <div className="font-mono text-sm font-semibold">{mineral.atomicNumber}</div>
                            <div className="font-bold text-lg">{mineral.symbol}</div>
                            <div className="text-xs truncate w-full px-1">{mineral.name}</div>
                            {isCollected && <div className="text-xs font-bold mt-0.5">x{collectionData?.count}</div>}
                            </>
                        ) : (
                            <span>&nbsp;</span>
                        )}
                        </div>
                    );
                })}
            </div>
        </div>

      </div>
    </Layout>
  );
};

export default CollectionPage; 