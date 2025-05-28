import React, { useEffect, useRef, useState } from "react";
import { Game } from "../game/gameLogic";
import GameHUD from "../components/game/GameHUD";
import GameOverModal from "../components/game/GameOverModal";
import { GAME_DURATION, MINERALS } from "../game/constants/gameData";
import { preloadImage } from "../lib/preloadImage";
import { useSession } from "next-auth/react";
import axios from "axios";

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

    const game = new Game(canvasRef.current, {
      onScoreUpdate: setScore,
      onTimeLeftUpdate: setTimeLeft,
      onGameOver: handleGameOver,
    });

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

  return (
    <div className="w-full h-screen overflow-hidden touch-none relative">
      <canvas ref={canvasRef} className="block w-full h-full"></canvas>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 z-50">
          <div className="loading loading-spinner loading-lg mb-4"></div>
        </div>
      )}

      {!isLoading && !gameOver && (
        <GameHUD
          score={score}
          timeLeft={timeLeft}
          boostCards={boostCards.map((boost) => ({
            ...boost,
            quantity: userBoosts[boost.id],
          }))}
          onBoostClick={handleBoostClick}
          cooldowns={cooldowns}
        />
      )}

      {gameOver && (
        <GameOverModal
          totalCollectedValue={totalCollectedValue}
          collectedMinerals={collectedMinerals}
          onGoToMainMenu={() => (window.location.href = "/")}
        />
      )}
    </div>
  );
};

export default GamePage;
