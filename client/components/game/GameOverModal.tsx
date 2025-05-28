import React from 'react';

interface GameOverModalProps {
  totalCollectedValue: number;
  collectedMinerals: Record<string, { count: number; value: number }>;
  onGoToMainMenu: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  totalCollectedValue,
  collectedMinerals,
  onGoToMainMenu,
}) => (
  <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-30 p-6">
    <h2 className="text-2xl font-bold">Insane!</h2>
    <h2 className="text-2xl mb-5 font-bold">How did you get so much?</h2>
    <h1 className="text-4xl font-bold mb-4">{totalCollectedValue} GTL</h1>
    <p className="mb-4">Earned</p>

    <div className="card bg-neutral grid grid-cols-3 gap-2 mb-6 p-3">
      {Object.entries(collectedMinerals).map(([image, { count, value }]) => (
        <div key={image} className="flex flex-col items-center justify-center bg-secondary p-2 rounded-xl">
          <img src={image} alt="" className="w-10 h-10" />
          <div className="text-xs">
            <p>Collected: {count}</p>
            <p>Value: {count * value} GTL</p>
          </div>
        </div>
      ))}
    </div>

    <button
      className="btn btn-base-100 border-2 border-accent shadow-glow text-lg"
      onClick={onGoToMainMenu}
    >
      Go to Main Menu
    </button>
  </div>
);

export default GameOverModal;
