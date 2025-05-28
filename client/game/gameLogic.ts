import { ImageEntity } from "./entities/ImageEntity";
import { MINERALS, GAME_DURATION, SPAWN_INTERVAL, BASE_HEIGHT, MIN_SPEED, MAX_SPEED } from "./constants/gameData";
import { getRandomMineral } from "./utils/helper";

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
    private gameTime: number = GAME_DURATION;
    private spawnTimer: NodeJS.Timeout | null = null;
    private gameTimer: NodeJS.Timeout | null = null;
    private lastUpdateTime: number = 0;
    private scoreMultiplier: number = 1;
    private doublePointsActive: boolean = false;
    private collectedMinerals: CollectedMinerals = {};

    // External callbacks for game events
    private onScoreUpdate?: (score: number) => void;
    private onTimeLeftUpdate?: (timeLeft: number) => void;
    private onGameOver?: (totalCollectedValue: number, collectedMinerals: CollectedMinerals) => void;

    constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks = {}) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d")!;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.onScoreUpdate = callbacks.onScoreUpdate;
        this.onTimeLeftUpdate = callbacks.onTimeLeftUpdate;
        this.onGameOver = callbacks.onGameOver;

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
        this.canvas.style.background = "#000";
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
        const pointsEarned = entity.points * this.scoreMultiplier;
        this.score += pointsEarned;
    
        const imgSrc = entity.image.src;
        if (!this.collectedMinerals[imgSrc]) {
            // Initialize the entry with count, value, and totalPoints
            this.collectedMinerals[imgSrc] = {
                count: 0,
                value: entity.points, // Set the base value here
                totalPoints: 0,
            };
        }
    
        // Update the entry
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
        const randomSpeed = (Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED) * speedFactor; 
        const mineral = getRandomMineral(MINERALS);

        const entity = new ImageEntity(randomX, -50, mineral.src, randomSpeed, mineral.points);
        this.entities.push(entity);
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

        // Spawn entities at a fixed interval
        this.spawnTimer = setInterval(() => this.spawnEntity(), SPAWN_INTERVAL);

        // Decrement the game time every second
        this.gameTimer = setInterval(() => {
            this.gameTime -= 1;
            if (this.onTimeLeftUpdate) {
                this.onTimeLeftUpdate(this.gameTime);
            }
            
            // When time hits zero, stop spawning new entities
            if (this.gameTime <= 0) {
                this.clearTimers();
            }
        }, 1000);

        // Begin the entity update loop
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
        const fastSpawnInterval = SPAWN_INTERVAL / 2;
        this.spawnTimer = setInterval(() => this.spawnEntity(), fastSpawnInterval);
        
        // After 5 seconds, revert to normal spawn rate
        setTimeout(() => {
            if (this.spawnTimer) {
                clearInterval(this.spawnTimer);
            }
            this.spawnTimer = setInterval(() => this.spawnEntity(), SPAWN_INTERVAL);
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
