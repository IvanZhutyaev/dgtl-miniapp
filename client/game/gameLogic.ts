import { ImageEntity } from "./entities/ImageEntity";
import { MINERALS as DEFAULT_MINERALS, GAME_DURATION as DEFAULT_GAME_DURATION, SPAWN_INTERVAL as DEFAULT_SPAWN_INTERVAL, BASE_HEIGHT, MIN_SPEED as DEFAULT_MIN_SPEED, MAX_SPEED as DEFAULT_MAX_SPEED } from "./constants/gameData";
import { getRandomMineral } from "./utils/helper";
import { LevelConfig } from "./constants/levels";
import { MINERALS } from "./constants/minerals";

interface CollectedMinerals {
    [imageSrc: string]: {
        count: number;
        value: number; 
        totalPoints: number; 
    };
}

interface GameCallbacks {
    onScoreUpdate?: (score: number) => void;
    onTimeLeftUpdate?: (timeLeft: number) => void;
    onGameOver?: (totalCollectedValue: number, collectedMinerals: CollectedMinerals) => void;
}

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private offscreenCanvas: HTMLCanvasElement;
    private offscreenContext: CanvasRenderingContext2D;

    private windowWidth: number;
    private windowHeight: number;

    private entities: ImageEntity[] = [];
    private score: number = 0;
    private gameTime: number;
    private spawnTimer: ReturnType<typeof setInterval> | null = null;
    private gameTimer: ReturnType<typeof setInterval> | null = null;
    private lastUpdateTime: number = 0;
    private scoreMultiplier: number = 1;
    private doublePointsActive: boolean = false;
    private collectedMinerals: CollectedMinerals = {};

    private level?: LevelConfig;
    private mineralsPool: any[];
    private spawnInterval: number;
    private minSpeed: number;
    private maxSpeed: number;

    // External callbacks for game events
    private onScoreUpdate?: (score: number) => void;
    private onTimeLeftUpdate?: (timeLeft: number) => void;
    private onGameOver?: (totalCollectedValue: number, collectedMinerals: CollectedMinerals) => void;

    constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks = {}, level?: LevelConfig) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d")!;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.onScoreUpdate = callbacks.onScoreUpdate;
        this.onTimeLeftUpdate = callbacks.onTimeLeftUpdate;
        this.onGameOver = callbacks.onGameOver;

        this.level = level;
        this.mineralsPool = level
            ? level.minerals.map(symbol => {
                const found = MINERALS.find((m: any) => m.symbol === symbol);
                return found || DEFAULT_MINERALS[0];
              })
            : DEFAULT_MINERALS;
        this.spawnInterval = level ? level.spawnInterval : DEFAULT_SPAWN_INTERVAL;
        this.minSpeed = level ? level.minSpeed : DEFAULT_MIN_SPEED;
        this.maxSpeed = level ? level.maxSpeed : DEFAULT_MAX_SPEED;
        this.gameTime = level ? level.duration : DEFAULT_GAME_DURATION;

        // Setup offscreen rendering for performance
        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCanvas.width = this.windowWidth;
        this.offscreenCanvas.height = this.windowHeight;
        this.offscreenContext = this.offscreenCanvas.getContext("2d")!;

        this.setupCanvas();
        this.setupEventListeners();
    }

    /**
     * Initializes the main canvas properties such as size and background.
     */
    private setupCanvas() {
        this.canvas.style.background = this.level ? this.level.background : "#000";
        this.canvas.width = this.windowWidth;
        this.canvas.height = this.windowHeight;
    }

    /**
     * Registers event listeners for user interaction.
     */
    private setupEventListeners() {
        this.canvas.addEventListener("pointerdown", this.handlePointerDown.bind(this));
    }

    /**
     * Pointer down event handler to detect clicks on entities.
     */
    private handlePointerDown(event: PointerEvent) {
        this.canvas.addEventListener("pointerdown", (event: PointerEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const mouseY = (event.clientY - rect.top) * (this.canvas.height / rect.height);

            for (let i = this.entities.length - 1; i >= 0; i--) {
                if (this.entities[i].isClicked(mouseX, mouseY)) {
                    const entity = this.entities[i];
                    this.collectEntity(entity);
                    this.entities.splice(i, 1);
                    break;
                }
            }
        });
    }


    /**
     * Unified method to handle collecting an entity.
     * Applies any active multipliers and updates score & collectedMinerals.
     */
    private collectEntity(entity: ImageEntity) {
        // Apply collection effects
        entity.collect();
        
        // Calculate points with dynamic multipliers
        const basePoints = entity.points;
        const comboMultiplier = this.calculateComboMultiplier();
        const levelMultiplier = this.level ? 1 + (this.level.id * 0.1) : 1;
        const pointsEarned = basePoints * this.scoreMultiplier * comboMultiplier * levelMultiplier;
        
        this.score += pointsEarned;

        const imgSrc = entity.image.src;
        if (!this.collectedMinerals[imgSrc]) {
            this.collectedMinerals[imgSrc] = {
                count: 0,
                value: entity.points,
                totalPoints: 0,
            };
        }

        this.collectedMinerals[imgSrc].count += 1;
        this.collectedMinerals[imgSrc].totalPoints += pointsEarned;

        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score);
        }
    }
    
    /**
     * Spawns a new mineral entity at a random position with a random speed.
     */
    private spawnEntity() {
        const randomX = Math.random() * (this.windowWidth - 50);
        const speedFactor = this.windowHeight / BASE_HEIGHT;
        
        // Calculate dynamic speed based on level and game progress
        const progressFactor = 1 - (this.gameTime / (this.level?.duration || DEFAULT_GAME_DURATION));
        const dynamicMinSpeed = this.minSpeed * (1 + progressFactor * 0.5);
        const dynamicMaxSpeed = this.maxSpeed * (1 + progressFactor * 0.3);
        
        const randomSpeed = (Math.random() * (dynamicMaxSpeed - dynamicMinSpeed) + dynamicMinSpeed) * speedFactor;
        
        // Weighted random selection for minerals
        const mineral = this.getWeightedRandomMineral();
        let imageSrc = ("image" in mineral && typeof mineral.image === "string") ? mineral.image : mineral.src;
        if (typeof imageSrc !== "string") imageSrc = "";
        
        const entity = new ImageEntity(randomX, -50, imageSrc, randomSpeed, mineral.points);
        this.entities.push(entity);
    }

    private getWeightedRandomMineral() {
        // Calculate weights based on mineral rarity and level
        const weights = this.mineralsPool.map(mineral => {
            const baseWeight = 1;
            const rarityBonus = mineral.points * 0.5; // Rarer minerals have higher points
            const levelBonus = this.level ? this.level.id * 0.1 : 0; // Higher levels increase rare mineral chances
            return baseWeight + rarityBonus + levelBonus;
        });

        // Normalize weights
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const normalizedWeights = weights.map(weight => weight / totalWeight);

        // Select mineral based on weights
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < this.mineralsPool.length; i++) {
            cumulativeWeight += normalizedWeights[i];
            if (random <= cumulativeWeight) {
                return this.mineralsPool[i];
            }
        }

        return this.mineralsPool[0]; // Fallback
    }

    private calculateComboMultiplier(): number {
        // Implement combo system based on recent collections
        const recentCollections = this.entities.filter(e => e.isCollected).length;
        return 1 + (recentCollections * 0.1); // 10% bonus per combo
    }

    /**
     * The main game update loop, called every animation frame.
     * Handles entity updates, clearing off-screen entities, and rendering.
     */
    private updateEntities(currentTime: number = 0) {
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        // Clear offscreen context before drawing
        this.offscreenContext.clearRect(0, 0, this.windowWidth, this.windowHeight);

        // Update each entity based on deltaTime
        this.entities.forEach((entity) => entity.update(this.offscreenContext, deltaTime));

        // Filter out entities that moved off-screen
        this.entities = this.entities.filter((entity) => !entity.isOffScreen(this.windowHeight));

        // Render the offscreen canvas onto the main canvas
        this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
        this.context.drawImage(this.offscreenCanvas, 0, 0);

        // Check if game should end
        if (this.gameTime <= 0) {
            this.endGame();
        } else {
            requestAnimationFrame((time) => this.updateEntities(time));
        }
    }

    /**
     * Starts the game by setting up timers and initial conditions.
     */
    public startGame() {
        this.lastUpdateTime = performance.now();
        this.spawnTimer = setInterval(() => this.spawnEntity(), this.spawnInterval);
        this.gameTimer = setInterval(() => {
            this.gameTime -= 1;
            if (this.onTimeLeftUpdate) {
                this.onTimeLeftUpdate(this.gameTime);
            }
            if (this.gameTime <= 0) {
                this.clearTimers();
            }
        }, 1000);
        this.updateEntities(this.lastUpdateTime);
    }

    /**
     * Ends the game, calculates final results, and triggers the onGameOver callback.
     */
    private endGame() {
        // Calculate total collected value using `totalPoints` to include boosts
        let totalValue = 0;
        for (const mineralKey in this.collectedMinerals) {
            totalValue += this.collectedMinerals[mineralKey].totalPoints;
        }
    
        // Trigger the game-over callback with the correct total value
        if (this.onGameOver) {
            this.onGameOver(totalValue, this.collectedMinerals);
        }
    
        // Clear any running timers
        this.clearTimers();
    }
    

    /**
     * Clears all running timers (spawn and game countdown) to prevent memory leaks.
     */
    private clearTimers() {
        if (this.spawnTimer) {
            clearInterval(this.spawnTimer);
            this.spawnTimer = null;
        }

        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    /**
     * Allows external triggering of boosts/power-ups.
     * Currently supports three types of boosts, can be extended easily.
     */
    public useBoost(boostId: string) {
        switch (boostId) {
            case 'boost1':
                this.applySpeedBoost();
                break;
            case 'boost2':
                this.applyDynamite();
                break;
            case 'boost3':
                this.applyDoublePointsBoost();
                break;
            default:
                console.warn(`Unknown boost ID: ${boostId}`);
        }
    }
      
    /**
     * Temporarily reduces the spawn interval for faster spawning.
     * Resets after 5 seconds.
     */
    private applySpeedBoost() {
        // Clear current spawn interval if active
        if (this.spawnTimer) {
            clearInterval(this.spawnTimer);
        }
        
        // Spawn entities twice as fast
        const fastSpawnInterval = this.spawnInterval / 2;
        this.spawnTimer = setInterval(() => this.spawnEntity(), fastSpawnInterval);
        
        // After 5 seconds, revert to normal spawn rate
        setTimeout(() => {
            if (this.spawnTimer) {
                clearInterval(this.spawnTimer);
            }
            this.spawnTimer = setInterval(() => this.spawnEntity(), this.spawnInterval);
        }, 5000);
    }
      
    /**
     * Dynamite boost clears all current entities, giving immediate points for all on-screen minerals.
     */
    private applyDynamite() {
        // Instead of manually duplicating scoring logic here:
        // just loop through entities and use collectEntity for each.
        for (const entity of this.entities) {
            this.collectEntity(entity);
        }

        // Clear all entities
        this.entities = [];
    }

    /**
     * Double points boost makes all future clicks worth double.
     * Lasts for 3 seconds.
     */
    private applyDoublePointsBoost() {
        if (this.doublePointsActive) return;

        console.log("Double Points Boost Activated!");
        this.doublePointsActive = true;
        this.scoreMultiplier = 2; // Apply multiplier here

        setTimeout(() => {
            console.log("Double Points Boost Ended!");
            this.doublePointsActive = false;
            this.scoreMultiplier = 1; // Revert to normal multiplier
        }, 3000);
    }
}
