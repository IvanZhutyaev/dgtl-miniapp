import React from "react";

interface IActiveBoost {
  id: string;
  imageUrl: string;
  quantity: number;
}

interface GameHUDProps {
  score: number;
  timeLeft: number;
  boostCards: IActiveBoost[];
  onBoostClick: (boostId: string) => void;
  cooldowns: { [key: string]: number | null };
  style?: React.CSSProperties;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, timeLeft, boostCards, onBoostClick, cooldowns, style }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center" style={style}>
      <div className="text-2xl font-bold">
        Score: {score} GTL
      </div>
      <div className="text-2xl font-bold">
        Time: {timeLeft}s
      </div>

      {/* Boosts Display */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        {boostCards.map((boost) => (
          <div
            key={boost.id}
            className="relative w-16 h-16 cursor-pointer"
            onClick={() => !cooldowns[boost.id] && onBoostClick(boost.id)}
          >
            <img
              src={boost.imageUrl}
              alt={`Boost ${boost.id}`}
              className="w-full h-full object-contain rounded-xl"
              style={{ opacity: cooldowns[boost.id] ? 0.6 : 1 }}
            />
            
            {/* Cooldown Overlay */}
            {cooldowns[boost.id] && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                <span className="text-white text-sm font-bold">
                  {cooldowns[boost.id]}s
                </span>
              </div>
            )}
            
            {/* Quantity Display */}
            <span className="absolute bottom-1.5 left-1.5 text-white text-xs font-bold">
              x{boost.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHUD;
