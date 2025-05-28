import { MIN_ROTATION_SPEED, MAX_ROTATION_SPEED } from "../constants/gameData";

export class ImageEntity {
    xpos: number;
    ypos: number;
    image: HTMLImageElement;
    speed: number;
    width: number = 50;
    height: number = 50;
    points: number;
    rotation: number = 0;
    rotationSpeed: number;

    constructor(xpos: number, ypos: number, imageSrc: string, speed: number, points: number) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.image = new Image();
        this.image.src = imageSrc;
        this.speed = speed;
        this.points = points;
        this.rotationSpeed = Math.random() * (MAX_ROTATION_SPEED - MIN_ROTATION_SPEED) + MIN_ROTATION_SPEED;
    }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.xpos + this.width / 2, this.ypos + this.height / 2);
        context.rotate(this.rotation);
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        context.restore();
    }

    update(context: CanvasRenderingContext2D, deltaTime: number) {
        this.rotation += this.rotationSpeed * deltaTime; 
        this.ypos += this.speed * deltaTime; 
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
}
