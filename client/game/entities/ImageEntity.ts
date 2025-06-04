import { MIN_ROTATION_SPEED, MAX_ROTATION_SPEED } from "../constants/gameData";

export class ImageEntity {
    xpos: number;
    ypos: number;
    image: HTMLImageElement;
    speed: number;
    symbol: string;
    width: number = 50;
    height: number = 50;
    points: number;
    rotation: number = 0;
    rotationSpeed: number;
    scale: number = 1;
    glowIntensity: number = 0;
    isCollected: boolean = false;
    trail: { x: number; y: number; alpha: number }[] = [];

    constructor(xpos: number, ypos: number, imageSrc: string, speed: number, points: number, symbol: string) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.image = new Image();
        this.image.src = imageSrc;
        this.speed = speed;
        this.points = points;
        this.symbol = symbol;
        this.rotationSpeed = Math.random() * (MAX_ROTATION_SPEED - MIN_ROTATION_SPEED) + MIN_ROTATION_SPEED;
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw trail
        this.trail.forEach((point, index) => {
            context.save();
            context.globalAlpha = point.alpha;
            context.translate(point.x + this.width / 2, point.y + this.height / 2);
            context.rotate(this.rotation);
            context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            context.restore();
        });

        // Draw glow effect
        if (this.glowIntensity > 0) {
            context.save();
            context.shadowColor = `rgba(255, 255, 255, ${this.glowIntensity})`;
            context.shadowBlur = 20;
            context.globalAlpha = this.glowIntensity;
            context.translate(this.xpos + this.width / 2, this.ypos + this.height / 2);
            context.rotate(this.rotation);
            context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            context.restore();
        }

        // Draw main image
        context.save();
        context.translate(this.xpos + this.width / 2, this.ypos + this.height / 2);
        context.rotate(this.rotation);
        context.scale(this.scale, this.scale);
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        context.restore();
    }

    update(context: CanvasRenderingContext2D, deltaTime: number) {
        // Update trail
        this.trail.unshift({ x: this.xpos, y: this.ypos, alpha: 0.5 });
        if (this.trail.length > 5) {
            this.trail.pop();
        }
        this.trail.forEach(point => point.alpha *= 0.8);

        // Update rotation and position
        this.rotation += this.rotationSpeed * deltaTime;
        this.ypos += this.speed * deltaTime;

        // Update effects
        if (this.isCollected) {
            this.scale *= 0.95;
            this.glowIntensity = Math.max(0, this.glowIntensity - 0.1);
        } else {
            this.scale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
            this.glowIntensity = Math.sin(Date.now() * 0.003) * 0.3 + 0.3;
        }

        this.draw(context);
    }

    isOffScreen(windowHeight: number): boolean {
        return this.ypos > windowHeight;
    }

    isClicked(mouseX: number, mouseY: number): boolean {
        const centerX = this.xpos + this.width / 2;
        const centerY = this.ypos + this.height / 2;
        const radius = Math.max(this.width, this.height) / 2 + 10;
        const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
        return distance <= radius;
    }

    collect() {
        this.isCollected = true;
        this.glowIntensity = 1;
    }
}
