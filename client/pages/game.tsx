import React, { useEffect, useRef, useState } from "react";
import { Game } from "../game/gameLogic";
import GameHUD from "../components/game/GameHUD";
import GameOverModal from "../components/game/GameOverModal";
import { GAME_DURATION, MINERALS } from "../game/constants/gameData";
import { preloadImage } from "../lib/preloadImage";
import { useSession } from "next-auth/react";
import axios from "axios";
import { LEVELS } from "../game/constants/levels";
import { useRouter } from "next/router";

interface BoostCard {
  id: string;
  imageUrl: string;
}

interface UserBoosts {
  [key: string]: number;
}

const BOOST_COOLDOWN_DURATION = 5; // Cooldown in seconds

const GamePage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [totalCollectedValue, setTotalCollectedValue] = useState(0);
  const [collectedMinerals, setCollectedMinerals] = useState<
    Record<string, { count: number; value: number }>
  >({});
  const [boostCards, setBoostCards] = useState<BoostCard[]>([]);
  const [userBoosts, setUserBoosts] = useState<UserBoosts>({});
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number | null }>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);

  const usedBoostsRef = useRef<UserBoosts>({}); // Track boosts used during the game

  /**
   * Function to update game data on the server
   */
  const updateGameData = async (
    collectedValue: number,
    usedBoosts: Record<string, number>
  ) => {
    try {
      const response = await axios.post("/api/updateСoins", {
        amount: collectedValue,
        boostsUsed: usedBoosts,
      });
      console.log("Game data updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating game data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boostsResponse = await axios.get("/api/boost-cards");
        setBoostCards(boostsResponse.data);

        if (session) {
          const userResponse = await axios.get("/api/user/data");
          setUserBoosts(userResponse.data.boosts || {});
        }

        setIsDataLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const imagePromises = MINERALS.map((m) => preloadImage(m.src));
        await Promise.all(imagePromises);
        setIsImagesLoading(false);
      } catch (err) {
        console.error("Failed to load assets:", err);
        setIsImagesLoading(false);
      }
    };

    preloadAssets();
  }, []);

  const initializeGame = () => {
    if (!canvasRef.current) return;

    // Получаем номер уровня из query
    const levelParam = router.query.level;
    let levelConfig = LEVELS[0];
    if (typeof levelParam === "string") {
      const idx = parseInt(levelParam, 10) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < LEVELS.length) {
        levelConfig = LEVELS[idx];
        setCurrentLevel(levelConfig);
      }
    }

    const game = new Game(canvasRef.current, {
      onScoreUpdate: setScore,
      onTimeLeftUpdate: setTimeLeft,
      onGameOver: handleGameOver,
    }, levelConfig);

    game.startGame();
    gameRef.current = game;
  };

  const handleGameOver = async (
    collectedValue: number,
    minerals: Record<string, { count: number; value: number }>
  ) => {
    setTotalCollectedValue(collectedValue);
    setCollectedMinerals(minerals);
    setGameOver(true);

    try {
      await updateGameData(collectedValue, usedBoostsRef.current);
    } catch (error) {
      console.error("Failed to update game data:", error);
    }
  };

  const handleBoostClick = (boostId: string) => {
    const currentQuantity = userBoosts[boostId] || 0;

    if (cooldowns[boostId]) {
      console.log(`Boost ${boostId} is on cooldown.`);
      return;
    }

    if (currentQuantity > 0) {
      // Deduct locally and track used boosts
      setUserBoosts((prev) => ({
        ...prev,
        [boostId]: prev[boostId] - 1,
      }));
      usedBoostsRef.current[boostId] = (usedBoostsRef.current[boostId] || 0) + 1;

      if (gameRef.current) {
        gameRef.current.useBoost(boostId);
      }

      startBoostCooldown(boostId, BOOST_COOLDOWN_DURATION);
    } else {
      console.log("No boost of this type available.");
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
    if (!isDataLoading && !isImagesLoading && canvasRef.current) {
      initializeGame();
    }
    return () => {
      const context = canvasRef.current?.getContext("2d");
      if (context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [isDataLoading, isImagesLoading]);

  const isLoading = isDataLoading || isImagesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="loading loading-spinner loading-lg mb-4"></div>
      </div>
    );
  }

  return (
    <div 
      className="card bg-neutral text-white overflow-hidden fixed inset-0 w-full h-full select-none touch-none"
      style={{
        background: `linear-gradient(to bottom, ${currentLevel.colorScheme.primary}, ${currentLevel.colorScheme.secondary})`
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full opacity-50"
        style={{
          backgroundImage: `url(${currentLevel.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)'
        }}
      />

      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full"
        style={{
          background: 'transparent'
        }}
      />

      {/* Game HUD */}
      <GameHUD
        score={score}
        timeLeft={timeLeft}
        boostCards={boostCards.map((boost) => ({
          ...boost,
          quantity: userBoosts[boost.id],
        }))}
        onBoostClick={handleBoostClick}
        cooldowns={cooldowns}
        style={{
          color: currentLevel.colorScheme.accent
        }}
      />

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          totalCollectedValue={totalCollectedValue}
          collectedMinerals={collectedMinerals}
          onGoToMainMenu={() => router.push('/')}
          style={{
            backgroundColor: currentLevel.colorScheme.secondary,
            color: currentLevel.colorScheme.accent
          }}
        />
      )}
    </div>
  );
};

export default GamePage;
