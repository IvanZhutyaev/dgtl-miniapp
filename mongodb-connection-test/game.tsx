import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';

// Define mineral interface
interface Mineral {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number; 
  rotationSpeed: number;
  rotation: number;
  image: string;
  value: number;
}

// Define each mineral's data with its image, value, and rotation speed
const mineralsData = [
  { image: "/minerals/1.png", value: 1, rotationSpeed: 1 },
  { image: "/minerals/2.png", value: 2, rotationSpeed: 1.5 },
  { image: "/minerals/3.png", value: 3, rotationSpeed: 2 },
  { image: "/minerals/au.png", value: 4, rotationSpeed: 2.5 },
];

const Game: React.FC = () => {
  const { data: session} = useSession();
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [collectedMinerals, setCollectedMinerals] = useState<Record<string, { count: number; value: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mineralIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);
  const router = useRouter();

  console.log(session)
  // Calculate total collected minerals value
  const totalCollectedValue: number = Object.values(collectedMinerals).reduce(
    (acc, mineral) => acc + mineral.count * mineral.value,
    0
  );

  useEffect(() => {
    // Check if Telegram API is available
    if (typeof window !== 'undefined' && window.Telegram) {
      // Initialize the Telegram WebApp
      window.Telegram.WebApp.ready();
    } else {
      alert("Telegram WebApp not found");
    }
  }, []); 

  // Preload images and video for the game
  const preloadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => reject();
    });
  };

  const preloadVideo = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement("video");
      video.src = src;
      video.oncanplaythrough = () => resolve();
      video.onerror = () => reject();
      video.load();
    });
  };

  // Preload all game assets
  const preloadAssets = async () => {
    try {
      const imagePromises = mineralsData.map((mineral) => preloadImage(mineral.image));
      await Promise.all([...imagePromises, preloadVideo("/game/bg/123.mp4")]);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load assets:", error);
    }
  };

  // Add a new mineral to the game area
  const addMineral = useCallback(async () => {
    if (!isGameOver) {
      const gameAreaWidth = gameAreaRef.current?.clientWidth || 0;
      const id = Math.random();
      const randomMineral = mineralsData[Math.floor(Math.random() * mineralsData.length)];

      try {
        await preloadImage(randomMineral.image);

        setMinerals((prev) => [
          ...prev,
          {
            id,
            x: Math.random() * (gameAreaWidth - 48),
            y: -24,
            radius: 15 + Math.random() * 10,
            speed: 100 + Math.random() * 50, // Speed in pixels per second
            rotationSpeed: randomMineral.rotationSpeed,
            rotation: 0,
            image: randomMineral.image,
            value: randomMineral.value,
          },
        ]);
      } catch (error) {
        console.error("Failed to load image:", randomMineral.image);
      }
    }
  }, [isGameOver]);

  // Update the position and rotation of minerals
  const updateMinerals = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setMinerals((prevMinerals) =>
        prevMinerals
          .map((mineral) => ({
            ...mineral,
            y: mineral.y + mineral.speed * deltaTime,
          }))
          .filter(
            (mineral) =>
              mineral.y - mineral.radius < (gameAreaRef.current?.clientHeight || 0)
          )
      );

      if (!isGameOver) {
        animationFrameRef.current = requestAnimationFrame(updateMinerals);
      }
    },
    [isGameOver]
  );

  // Initialize the animation
  useEffect(() => {
    if (!isGameOver) {
      animationFrameRef.current = requestAnimationFrame(updateMinerals);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameOver, updateMinerals]);

  // Interval to add minerals
  useEffect(() => {
    mineralIntervalRef.current = setInterval(addMineral, 300);

    return () => {
      if (mineralIntervalRef.current) {
        clearInterval(mineralIntervalRef.current);
      }
    };
  }, [addMineral]);

  // Countdown timer for the game
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      if (mineralIntervalRef.current) {
        clearInterval(mineralIntervalRef.current);
      }
    }
  }, [timeLeft, isGameOver]);

  // Handle mineral click
  const handleMineralClick = useCallback((id: number, value: number, image: string) => {

    if (window.Telegram?.WebApp?.hapticFeedback) {
      window.Telegram.WebApp.hapticFeedback.impactOccurred('medium');
    }

    setMinerals((prevMinerals) => prevMinerals.filter((mineral) => mineral.id !== id));
    setScore((prevScore) => prevScore + value);
    setCollectedMinerals((prev) => ({
      ...prev,
      [image]: {
        count: (prev[image]?.count || 0) + 1,
        value,
      },
    }));
  }, []);

  const goToMainMenu = async () => {
    router.push('/');
  }

  const [isEndHandled, setIsEndHandled] = useState(false);

  useEffect(() => {
    if (isGameOver && !isEndHandled) {
      setIsEndHandled(true); // Prevent multiple executions

      // Function to update coins
      const updateCoins = async () => {
        try {
          const response = await fetch('/api/updateCoins', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalCollectedValue }),
          });

          const data = await response.json();
          if (!response.ok) {
            console.error('Error updating coins1:', data.error || data.message);
          } else {
            console.log('Coins updated:', data.coins);
          }
        } catch (error) {
          console.error('Error updating coins2:', error);
        }
      };

      updateCoins();
    }
  }, [isGameOver, isEndHandled, totalCollectedValue]);


  // Load assets when the component mounts
  useEffect(() => {
    preloadAssets();
  }, []);

  // Display loading screen while assets are loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-base-100">
        <div className="loading loading-spinner loading-lg mb-4"></div>
      </div>
    );
  }

  return (
    <div className="card bg-neutral text-white overflow-hidden fixed inset-0 w-full h-full select-none touch-none">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/game/bg/123.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Game Area with Padding Inside */}
      <div
        ref={gameAreaRef}
        className="relative z-10 w-full h-full bg-base-100 bg-opacity-50 overflow-hidden select-none p-3 box-border"
        style={{ userSelect: "none" }}
      >
        {/* Score Display */}
        <h1 className="absolute top-4 left-4 text-2xl z-20 pointer-events-none">
          Score: {score}
        </h1>

        {/* Timer Display */}
        <h2 className="absolute top-4 right-4 text-2xl z-20 pointer-events-none">
          Time Left: {timeLeft}s
        </h2>

        {/* Render Minerals */}
        {minerals.map((mineral) => (
          <div
            key={mineral.id}
            id={`mineral-${mineral.id}`}
            onPointerDown={() =>
              handleMineralClick(mineral.id, mineral.value, mineral.image)
            }
            style={{
              position: "absolute",
              left: mineral.x - 20,
              top: mineral.y - 5,
              width: mineral.radius * 2 + 15,
              height: mineral.radius * 2 + 15,
              cursor: "pointer",
              transform: `rotate(${mineral.rotation}deg)`,
              transition: "transform 0.1s",
              pointerEvents: "auto",
              touchAction: "manipulation",
            }}
          >
            <img
              src={mineral.image}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-30 p-6">
          <h2 className="text-2xl font-bold">Insane!</h2>
          <h2 className="text-2xl mb-5 font-bold">How did you get so much?</h2>
          <h1 className="text-4xl font-bold mb-4">{totalCollectedValue} GTL</h1>
          <p className="mb-4">Earned</p>

          {/* Display Collected Minerals */}
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
            onClick={goToMainMenu}
          >
            Go to Main Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
