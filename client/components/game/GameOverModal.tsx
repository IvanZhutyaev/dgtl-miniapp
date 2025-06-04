import React from 'react';

interface GameOverModalProps {
  totalCollectedValue: number;
  collectedMinerals: Record<string, number>;
  onGoToMainMenu: () => void;
  style?: React.CSSProperties;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  totalCollectedValue,
  collectedMinerals,
  onGoToMainMenu,
  style
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="modal-box max-w-2xl w-full mx-4"
        style={style}
      >
        <h3 className="font-bold text-2xl mb-4">Game Over!</h3>
        
        <div className="mb-4">
          <p className="text-xl">Total Value: {totalCollectedValue} GTL</p>
        </div>

        <div className="mb-4">
          <h4 className="font-bold text-lg mb-2">Collected Minerals:</h4>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(collectedMinerals).map(([mineral, count]) => (
              <div key={mineral} className="flex items-center justify-between p-2 bg-base-200 rounded">
                <span>{mineral}</span>
                <span className="font-bold">{count}</span>
                
              </div>
            ))}
          </div>
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-primary"
            onClick={onGoToMainMenu}
          >
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
