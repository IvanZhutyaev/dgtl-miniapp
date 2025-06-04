import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Game } from "../game/gameLogic";
import GameHUD from "../components/game/GameHUD";
import GameOverModal from "../components/game/GameOverModal";
import { GAME_DURATION } from "../game/constants/gameData";
import { MINERALS as ELEMENT_DEFINITIONS, MineralInfo } from "../game/constants/minerals";
import { preloadImage } from "../lib/preloadImage";
import { useSession } from "next-auth/react";
import axios from "axios";
import { LEVELS, LevelConfig } from "../game/constants/levels";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface BoostCard {
  id: string;
  imageUrl: string;
}

interface UserBoosts {
  [key: string]: number;
}

const BOOST_COOLDOWN_DURATION = 5; // Cooldown in seconds

// Статичный список имен файлов, которые существуют в client/public/minerals/
// Этот список основан на последнем выводе list_dir. Обновите его, если добавляете/удаляете файлы.
const staticAvailableImageFileNames = new Set([
  "Ag.png", "Al.png", "Ar.png", "Au.png", "B.png", "Ba.png", "Be.png", "Br.png", "C.png", 
  "Ca.png", "Cf.png", "Cl.png", "Cm.png", "Cs.png", "Cu.png", "F.png", "Fe.png", "Fr.png", "Ge.png", 
  "H.png", "Hf.png", "He.png", "I.png", "K.png", "Kr.png", "Li.png", "LR.png", "Lu.png", "Lv.png", "Md.png", 
  "Mg.png", "N.png", "Na.png", "Ne.png", "No.png", "O.png", "P.png", "Pb.png", "Ra.png", "Rb.png", 
  "Re.png", "S.png", "Sb.png", "Sc.png", "Se.png", "Si.png", "Sn.png", "Sr.png", "Te.png", "Tm.png", 
  "U.png", "Xe.png" 
  // Файл Ci.png игнорируется в пользу Cm.png
  // Файл vopros2.png игнорируется
]);

// Type for the state managed by gameLogic.ts
interface CollectedGameLogicState {
    [mineralSymbol: string]: {
        count: number;
        value: number; // Base value of the mineral
        totalPoints: number; // Points including multipliers
    };
}

const GamePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [totalCollectedValue, setTotalCollectedValue] = useState(0);
  const [collectedMineralsFromGame, setCollectedMineralsFromGame] = useState<
    Record<string, { count: number; value: number }>
  >({});
  const [boostCards, setBoostCards] = useState<BoostCard[]>([]);
  const [userBoosts, setUserBoosts] = useState<UserBoosts>({});
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number | null }>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const [finalDetailedCollectedMinerals, setFinalDetailedCollectedMinerals] = useState<CollectedGameLogicState | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  // Мемоизированный список действительно доступных определений элементов
  const trulyAvailableElementDefs = useMemo(() => {
    return ELEMENT_DEFINITIONS.filter(def => {
      const fileName = def.image.split('/').pop();
      return fileName ? staticAvailableImageFileNames.has(fileName) : false;
    });
  }, []); // Зависимостей нет, т.к. ELEMENT_DEFINITIONS и staticAvailableImageFileNames не меняются

  const usedBoostsRef = useRef<UserBoosts>({}); // Track boosts used during the game

  /**
   * Function to update game data on the server
   */
  const updateGameData = useCallback(async (
    collectedValue: number,
    usedBoosts: Record<string, number>,
    mineralsForApi?: CollectedGameLogicState
  ) => {
    let apiFormattedMinerals: { [symbol: string]: number } = {};
    if (mineralsForApi) {
      for (const symbol in mineralsForApi) {
        if (Object.prototype.hasOwnProperty.call(mineralsForApi, symbol) && mineralsForApi[symbol] && mineralsForApi[symbol].count > 0) {
          apiFormattedMinerals[symbol] = mineralsForApi[symbol].count;
        }
      }
    }

    const payload = {
      score: collectedValue,
      boostsUsed: usedBoosts,
      collectedMineralsInGame: apiFormattedMinerals,
    };

    try {
      const response = await axios.post("/api/updateCoins", payload);
      console.log("Данные игры успешно обновлены (из updateGameData):", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении данных игры в updateGameData:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true); // Set loading true at the start
      try {
        const boostsResponse = await axios.get("/api/boost-cards");
        setBoostCards(boostsResponse.data);

        if (session) {
          const userResponse = await axios.get("/api/user/data");
          setUserBoosts(userResponse.data.boosts || {});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading game data.");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (status !== 'loading') { // Avoid fetching if session status is loading
        fetchData();
    }
  }, [session, status]);

  useEffect(() => {
    const preloadAssets = async () => {
      if (trulyAvailableElementDefs.length === 0) {
        console.warn("No mineral images to preload.");
        setIsImagesLoading(false);
        return;
      }
      setIsImagesLoading(true);
      try {
        const imagePromises = trulyAvailableElementDefs.map((m) => preloadImage(m.image));
        await Promise.all(imagePromises);
      } catch (err) {
        console.error("Error preloading some mineral assets:", err);
        toast.error("Error loading images.");
      } finally {
        setIsImagesLoading(false);
      }
    };
    preloadAssets();
  }, [trulyAvailableElementDefs]);

  const handleGameOverCallback = useCallback(async (
    collectedValue: number,
    mineralsFromGame: CollectedGameLogicState
  ) => {
    console.log("[GamePage] handleGameOverCallback triggered. collectedValue:", collectedValue, "mineralsFromGame:", JSON.stringify(mineralsFromGame));
    setTotalCollectedValue(collectedValue); 
    setFinalDetailedCollectedMinerals(mineralsFromGame);
    setFinalScore(collectedValue); 
    setGameOver(true);

    try {
      await updateGameData(collectedValue, usedBoostsRef.current, mineralsFromGame);
      
      const levelIdParam = router.query.level; 
      if (typeof levelIdParam === 'string' && currentLevel) { 
        const completedLevelId = currentLevel.id.toString(); 
        const response = await axios.post(`/api/levels/check-next/${completedLevelId}`, {
          score: collectedValue
        });
        
        if (response.data.unlocked && response.data.level) {
          toast.success(`Congratulations! You've unlocked level: ${response.data.level.name}!`);
        } else if (response.data.message) {
          toast(response.data.message);
        }
      }
    } catch (error) {
      console.error("Failed to update game data or check next level:", error);
      toast.error("Error saving game progress.");
    }
  }, [router.query.level, currentLevel, updateGameData]);

  const initializeGame = useCallback(() => {
    if (!canvasRef.current) {
      console.error("[GamePage Initialize] Canvas ref is not set.");
      return;
    }
    if (!currentLevel) {
      console.warn("[GamePage Initialize] Attempted to initialize game but currentLevel is null.");
      return;
    }
    if (trulyAvailableElementDefs.length === 0 && ELEMENT_DEFINITIONS.length > 0) {
      console.warn("[GamePage Initialize] Cannot initialize game: no available mineral definitions for loading.");
      toast("Error: No minerals available for this level.");
      return;
    }

    console.log(`[GamePage Initialize] Initializing game for level: ${currentLevel.name}`);
    
    // Reset game-specific states before starting a new game instance
    setScore(0);
    setGameOver(false);
    // setTimeLeft is already set when currentLevel is set, or can be set here again to be sure.
    setTimeLeft(currentLevel.duration); 
    usedBoostsRef.current = {}; // Reset used boosts for the new game session

    const gameInstance = new Game(
      canvasRef.current,
      {
        onScoreUpdate: setScore,
        onTimeLeftUpdate: setTimeLeft,
        onGameOver: handleGameOverCallback,
      },
      currentLevel, // Pass the confirmed currentLevel
      trulyAvailableElementDefs
    );

    gameInstance.startGame();
    gameRef.current = gameInstance;
  }, [currentLevel, trulyAvailableElementDefs, handleGameOverCallback]);

  // Effect to initialize or re-initialize the game when dependencies change
  useEffect(() => {
    if (currentLevel && !isDataLoading && !isImagesLoading && !gameOver && canvasRef.current) {
      initializeGame();
    }

    return () => {
      if (gameRef.current) {
        // gameRef.current.clearTimers(); // TODO: Expose a public method in Game class for cleanup
      }
    };
  }, [currentLevel, isDataLoading, isImagesLoading, gameOver, initializeGame]);

  const handleBoostClick = (boostId: string) => {
    const currentQuantity = userBoosts[boostId] || 0;

    if (cooldowns[boostId]) {
      toast(`Boost ${boostId} is on cooldown.`);
      return;
    }

    if (currentQuantity > 0) {
      setUserBoosts((prev) => ({
        ...prev,
        [boostId]: Math.max(0, prev[boostId] - 1),
      }));
      usedBoostsRef.current[boostId] = (usedBoostsRef.current[boostId] || 0) + 1;

      if (gameRef.current) {
        gameRef.current.useBoost(boostId); // Assuming Game class has useBoost
      }
      toast.success(`Boost ${boostId} activated!`);
      startBoostCooldown(boostId, BOOST_COOLDOWN_DURATION);
    } else {
      toast("No boost of this type available.");
    }
  };

  const startBoostCooldown = (boostId: string, duration: number) => {
    setCooldowns((prev) => ({ ...prev, [boostId]: duration }));

    const cooldownInterval = setInterval(() => {
      setCooldowns((prev) => {
        const currentTime = prev[boostId];
        if (!currentTime) {
          clearInterval(cooldownInterval);
          return prev;
        }

        const newTime = currentTime - 1;
        if (newTime <= 0) {
          clearInterval(cooldownInterval);
          return { ...prev, [boostId]: null };
        }

        return { ...prev, [boostId]: newTime };
      });
    }, 1000);
  };

  useEffect(() => {
    if (router.isReady) {
      const levelIdParam = router.query.level;

      if (typeof levelIdParam === "string") {
        const parsedLevelId = parseInt(levelIdParam, 10);

        if (!isNaN(parsedLevelId) && parsedLevelId > 0) {
          const foundLevel = LEVELS.find(l => l.id === parsedLevelId);
          if (foundLevel) {
            setCurrentLevel(foundLevel);
            setTimeLeft(foundLevel.duration); 
          } else {
            console.error("[GamePage Debug] Level config not found for ID:", parsedLevelId);
            setCurrentLevel(null);
            toast.error(`Level ${parsedLevelId} not found.`);
          }
        } else {
          console.error("[GamePage Debug] Invalid levelIdParam after parsing:", parsedLevelId);
          setCurrentLevel(null);
          toast.error("Invalid level identifier in URL.");
        }
      } else if (levelIdParam === undefined) {
        console.warn("[GamePage Debug] levelIdParam is undefined. Waiting for router or param missing.");
      } else {
        console.error("[GamePage Debug] levelIdParam is not a string or undefined:", levelIdParam);
        setCurrentLevel(null);
        toast.error("Invalid level parameter type in URL.");
      }
    }
  }, [router.isReady, router.query.level]);

  const isLoading = isDataLoading || isImagesLoading;

  if (gameOver) {
    if (finalDetailedCollectedMinerals && currentLevel) {
        const gameOverModalMineralsData: Record<string, number> = {};
        for (const [symbol, data] of Object.entries(finalDetailedCollectedMinerals)) {
            gameOverModalMineralsData[symbol] = data.count;
        }

        return (
        <GameOverModal
            totalCollectedValue={finalScore}
            collectedMinerals={gameOverModalMineralsData}
            onGoToMainMenu={() => router.push("/")}
        />
        );
    } else {
        // Fallback for gameOver=true but missing data (should ideally not happen)
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Loading game results...
            </div>
        );
    }
  }

  if (!router.isReady || (router.isReady && router.query.level === undefined && !currentLevel)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <p>Initializing Game Page...</p>
      </div>
    );
  }

  if (currentLevel === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: 'column' }}>
        <p>Error: Level not found.</p>
        <p>(Details: Searched for level ID based on URL parameter: "{String(router.query.level)}")</p>
        <button onClick={() => router.push('/')} style={{marginTop: '10px', padding: '8px 16px'}}>Go to Main Menu</button>
      </div>
    );
  }

  if (isDataLoading || isImagesLoading) {
    let loadingMessage = "Loading game assets...";
    if (isDataLoading) loadingMessage = "Loading essential game data...";
    else if (isImagesLoading) loadingMessage = "Preparing mineral images...";
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <p>{loadingMessage}</p>
        <p>(Level: {currentLevel.name})</p>
      </div>
    );
  }
  
  const backgroundStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  };
  
  // Prepare boostCards for GameHUD
  const activeBoostsForHUD = boostCards.map(card => ({
    id: card.id,
    imageUrl: card.imageUrl,
    quantity: userBoosts[card.id] || 0, // Get quantity from userBoosts
  }));

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-800 flex flex-col items-center justify-center">
      {currentLevel.backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline // Important for mobile browsers
          style={backgroundStyle}
          className="object-cover"
          key={currentLevel.backgroundVideo} // Ensures video reloads if source changes
        >
          <source src={currentLevel.backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {!currentLevel.backgroundVideo && currentLevel.backgroundImage && (
         <div 
            style={{
                ...backgroundStyle,
                backgroundImage: `url(${currentLevel.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
         />
      )}
       {!currentLevel.backgroundVideo && !currentLevel.backgroundImage && currentLevel.background && (
         <div 
            style={{
                ...backgroundStyle,
                backgroundColor: currentLevel.background,
            }}
         />
      )}
       {/* Fallback solid background if no other background is defined */}
       {!currentLevel.backgroundVideo && !currentLevel.backgroundImage && !currentLevel.background && (
         <div 
            style={{
                ...backgroundStyle,
                backgroundColor: '#181818', // Default fallback color
            }}
         />
      )}

      <GameHUD
        score={score}
        timeLeft={timeLeft}
        boostCards={activeBoostsForHUD}
        onBoostClick={handleBoostClick}
        cooldowns={cooldowns}
      />
      
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full" // Ensure canvas is on top
        style={{ background: 'none' }} // Transparent background for the canvas itself
      />
    </div>
  );
};

export default GamePage;
