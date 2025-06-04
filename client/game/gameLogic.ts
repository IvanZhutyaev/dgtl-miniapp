import { ImageEntity } from "./entities/ImageEntity";
import { MINERALS as DEFAULT_MINERALS, GAME_DURATION as DEFAULT_GAME_DURATION, SPAWN_INTERVAL as DEFAULT_SPAWN_INTERVAL, BASE_HEIGHT, MIN_SPEED as DEFAULT_MIN_SPEED, MAX_SPEED as DEFAULT_MAX_SPEED } from "./constants/gameData";
import { getRandomMineral } from "./utils/helper";
import { LevelConfig } from "./constants/levels";
import { MineralInfo, MINERALS as ALL_MINERALS } from "./constants/minerals";

interface CollectedMinerals {
    [mineralSymbol: string]: {
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
    private mineralsPool: MineralInfo[] = [];
    private spawnInterval: number;
    private minSpeed: number;
    private maxSpeed: number;

    // External callbacks for game events
    private onScoreUpdate?: (score: number) => void;
    private onTimeLeftUpdate?: (timeLeft: number) => void;
    private onGameOver?: (totalCollectedValue: number, collectedMinerals: CollectedMinerals) => void;
    private availableElements: MineralInfo[];

    constructor(
        canvas: HTMLCanvasElement,
        callbacks: GameCallbacks = {},
        level?: LevelConfig,
        availableElementDefs: MineralInfo[] = []
    ) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d")!;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.onScoreUpdate = callbacks.onScoreUpdate;
        this.onTimeLeftUpdate = callbacks.onTimeLeftUpdate;
        this.onGameOver = callbacks.onGameOver;

        this.level = level;
        this.availableElements = availableElementDefs.length > 0 ? availableElementDefs : ALL_MINERALS;

        if (level) {
            const levelMineralSymbols = new Set(level.minerals);
            this.mineralsPool = ALL_MINERALS.filter(mineral => levelMineralSymbols.has(mineral.symbol));

            if (this.mineralsPool.length === 0 && level.minerals.length > 0) {
                console.warn(`Для уровня ${level.id} ('${level.name}') указаны минералы (${level.minerals.join(', ')}), но ни один из них не найден в общем списке MINERALS. Пул спавна будет пуст.`);
            } else if (level.minerals.length === 0) {
                console.warn(`Для уровня ${level.id} ('${level.name}') не указаны минералы для спавна (level.minerals пуст). Пул спавна будет пуст.`);
            }
        } else if (availableElementDefs.length > 0) {
            this.mineralsPool = availableElementDefs;
            console.warn("Игра запущена без конфигурации уровня, используя переданный список доступных элементов.");
        } else {
            console.error("В конструктор Game не передана конфигурация уровня и нет списка доступных элементов. Пул минералов будет пуст.");
            this.mineralsPool = [];
        }

        this.spawnInterval = level ? level.spawnInterval : DEFAULT_SPAWN_INTERVAL;
        this.minSpeed = level ? level.minSpeed : DEFAULT_MIN_SPEED;
        this.maxSpeed = level ? level.maxSpeed : DEFAULT_MAX_SPEED;
        this.gameTime = level ? level.duration : DEFAULT_GAME_DURATION;

        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCanvas.width = this.windowWidth;
        this.offscreenCanvas.height = this.windowHeight;
        this.offscreenContext = this.offscreenCanvas.getContext("2d")!;

        this.setupCanvas();
        this.setupEventListeners();
    }

    private setupCanvas() {
        this.canvas.style.background = this.level ? this.level.background : "#000";
        if (this.level && this.level.backgroundImage) {
            this.canvas.style.backgroundImage = `url(${this.level.backgroundImage})`;
            this.canvas.style.backgroundSize = "cover";
            this.canvas.style.backgroundPosition = "center";
            this.canvas.style.backgroundRepeat = "no-repeat";
        } else {
            this.canvas.style.backgroundImage = "none";
        }
        this.canvas.width = this.windowWidth;
        this.canvas.height = this.windowHeight;
    }

    private setupEventListeners() {
        this.canvas.addEventListener("pointerdown", this.handlePointerDown.bind(this));
    }

    private handlePointerDown(event: PointerEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.canvas.height / rect.height);

        for (let i = this.entities.length - 1; i >= 0; i--) {
            if (this.entities[i] && this.entities[i].isClicked(mouseX, mouseY)) {
                const entity = this.entities[i];
                this.collectEntity(entity);
                this.entities.splice(i, 1);
                break;
            }
        }
    }

    private collectEntity(entity: ImageEntity) {
        entity.collect();

        const basePoints = entity.points;
        const comboMultiplier = this.calculateComboMultiplier();
        const levelMultiplier = this.level ? 1 + (this.level.id * 0.1) : 1;
        const pointsEarned = basePoints * this.scoreMultiplier * comboMultiplier * levelMultiplier;

        this.score += pointsEarned;

        const mineralSymbol = entity.symbol;
        const updatedCollectedMinerals = { ...this.collectedMinerals };

        if (!updatedCollectedMinerals[mineralSymbol]) {
            updatedCollectedMinerals[mineralSymbol] = {
                count: 0,
                value: entity.points,
                totalPoints: 0,
            };
        }

        updatedCollectedMinerals[mineralSymbol].count += 1;
        updatedCollectedMinerals[mineralSymbol].totalPoints += pointsEarned;

        this.collectedMinerals = updatedCollectedMinerals;

        if (this.onScoreUpdate) {
            this.onScoreUpdate(parseFloat(this.score.toFixed(2)));
        }
    }

    private spawnEntity() {
        if (this.mineralsPool.length === 0) {
            return;
        }

        const randomX = Math.random() * (this.windowWidth - 50);
        const speedFactor = this.windowHeight / BASE_HEIGHT;

        const progressFactor = 1 - (this.gameTime / (this.level?.duration || DEFAULT_GAME_DURATION));
        const dynamicMinSpeed = this.minSpeed * (1 + progressFactor * 0.5);
        const dynamicMaxSpeed = this.maxSpeed * (1 + progressFactor * 0.3);

        const randomSpeed = (Math.random() * (dynamicMaxSpeed - dynamicMinSpeed) + dynamicMinSpeed) * speedFactor;

        const mineral = this.getWeightedRandomMineral();

        if (!mineral) {
            return;
        }

        let imageSrc = mineral.image;

        const entity = new ImageEntity(randomX, -50, imageSrc, randomSpeed, mineral.points, mineral.symbol);
        this.entities.push(entity);
    }

    private getWeightedRandomMineral(): MineralInfo | undefined {
        if (this.mineralsPool.length === 0) {
            return undefined;
        }
        const weights = this.mineralsPool.map(mineral => {
            const baseWeight = 1;
            const rarityBonus = mineral.points * 0.5;
            const levelBonus = this.level ? this.level.id * 0.1 : 0;
            return baseWeight + rarityBonus + levelBonus;
        });

        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const normalizedWeights = weights.map(weight => weight / totalWeight);

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
        const recentCollections = this.entities.filter(e => e.isCollected).length;
        return 1 + (recentCollections * 0.1);
    }

    private updateEntities(currentTime: number = 0) {
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        this.offscreenContext.clearRect(0, 0, this.windowWidth, this.windowHeight);
        this.entities.forEach((entity) => entity.update(this.offscreenContext, deltaTime));
        this.entities = this.entities.filter((entity) => !entity.isOffScreen(this.windowHeight));

        this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
        this.context.drawImage(this.offscreenCanvas, 0, 0);

        if (this.gameTime <= 0) {
            this.endGame();
        } else {
            requestAnimationFrame((time) => this.updateEntities(time));
        }
    }

    public startGame() {
        this.collectedMinerals = {};
        this.score = 0;
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

    private endGame() {
        let totalValue = 0;
        for (const mineralKey in this.collectedMinerals) {
            totalValue += this.collectedMinerals[mineralKey].totalPoints;
        }

        if (this.onGameOver) {
            this.onGameOver(parseFloat(totalValue.toFixed(2)), this.collectedMinerals);
        }

        this.clearTimers();
    }

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

    private applySpeedBoost() {
        if (this.spawnTimer) {
            clearInterval(this.spawnTimer);
        }
        const fastSpawnInterval = this.spawnInterval / 2;
        this.spawnTimer = setInterval(() => this.spawnEntity(), fastSpawnInterval);
        setTimeout(() => {
            if (this.spawnTimer) {
                clearInterval(this.spawnTimer);
            }
            this.spawnTimer = setInterval(() => this.spawnEntity(), this.spawnInterval);
        }, 5000);
    }

    private applyDynamite() {
        for (const entity of this.entities) {
            this.collectEntity(entity);
        }
        this.entities = [];
    }

    private applyDoublePointsBoost() {
        if (this.doublePointsActive) return;
        console.log("Double Points Boost Activated!"); // Можно оставить для информации игроку
        this.doublePointsActive = true;
        this.scoreMultiplier = 2;
        setTimeout(() => {
            console.log("Double Points Boost Ended!"); // Можно оставить для информации игроку
            this.doublePointsActive = false;
            this.scoreMultiplier = 1;
        }, 3000);
    }
}