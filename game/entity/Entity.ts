///<reference path='../Game.ts' />

module entity {
	
	export class Entity {
		
		world: World;
		x: number;
		y: number;
		width: number;
		height: number;
		velX = 0;
		velY = 0;
		gravity = 200.0;
		bounce = 0;
		onFloor: number;
		justCollided: boolean;
		lastCollisionXSpeed: number;
		lastCollisionYSpeed: number;
		
		type:string;
		
		constructor(x = 0, y = 0, width = 0, height = 0) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.onFloor = -1;
		}
		
		// Called when the entity is added to the world
		added(): void {}
		
		// Called when the entity is removed from the world
		removed():void {}
		
		collide(e: Entity): boolean {
			var collided = false;
			var x2;
			if (this.x < e.x) {
				x2 = this.x + this.width - 1;
				if (x2 >= e.x) collided = true;
			}
			else {
				x2 = e.x + e.width - 1;
				if (x2 >= this.x) collided = true;
			}
			if (!collided) return false;
			var y2;
			collided = false;
			if (this.y < e.y) {
				y2 = this.y + this.height - 1;
				if (y2 >= e.y) collided = true;
			}
			else {
				y2 = e.y + e.height - 1;
				if (y2 >= this.y) collided = true;
			}
			return collided;
		}
		
		//Check if an object collides with the map at the given position
		collideMap(x=this.x, y=this.y, fullcheck=true): boolean {
			if (fullcheck) {
				for (var i=x; i<x+this.width; i++) {
					for (var j = y; j < y + this.height; j++) {
						if (this.world.isSolid(i, j)) {
							return true;
						}
					}
				}
				return false;
			}
			else {
				for (var i=x; i<x+this.width; i++) {
					if (this.world.isSolid(i, y)) {
						return true;
					}
					if (this.world.isSolid(i, y + this.height - 1)) {
						return true;
					}
				}
				for (var j = y + 1; j < y + this.height - 1; j++) {
					if (this.world.isSolid(x, j)) {
						return true;
					}
					if (this.world.isSolid(x + this.width - 1, j)) {
						return true;
					}
				}
				return false;
			}
		}
		
		
		protected residueX = 0;
		protected residueY = 0;
		
		resolveMovementX(dx:number): void {
			this.residueX += dx;
			dx = Math.round(this.residueX);
			this.residueX -= dx;
			
			var sign = dx > 0 ? 1 : -1;
			
			while (dx != 0) {
				if (this.collideMap(this.x+sign, this.y, false)) {
					this.justCollided = true;
					this.lastCollisionXSpeed = this.velX;
					this.lastCollisionYSpeed = this.velY;
					this.velX *= -this.getBounce();
					break;
				}
				this.x += sign;
				dx -= sign;
				this.onFloor = -1;
			}
		}
		
		resolveMovementY(dy:number):void {
			this.residueY += dy;
			dy = Math.round(this.residueY);
			this.residueY -= dy;
			
			var sign = dy > 0 ? 1 : -1;
			
			while (dy != 0) {
				if (this.collideMap(this.x, this.y+sign, false)) {
					this.justCollided = true;
					this.lastCollisionXSpeed = this.velX;
					this.lastCollisionYSpeed = this.velY;
					this.velY *= -this.getBounce();
					break;
				}
				this.y += sign;
				dy -= sign;
				this.onFloor = -1;
			}
		}
		
		tick(): void {
			this.justCollided = false;
			this.velY += this.gravity * Game.DT_PER_TICK;
			this.resolveMovementX(this.velX * Game.DT_PER_TICK);
			this.resolveMovementY(this.velY * Game.DT_PER_TICK);
		}
		
		render():void {
			var c = this.world.context;
			c.fillStyle = "BLACK";
			c.fillRect(this.x, this.y, this.width, this.height);
		}
		
		isAtRest(): boolean {
			return Math.abs(this.velX) < Game.MIN_SPEED && Math.abs(this.velY) < Game.MIN_SPEED;
		}
		
		isOnFloor(): boolean {
			if (this.onFloor == -1) {
				if (this.collideMap(this.x, this.y+1, false)) this.onFloor = 1;
				else this.onFloor = 0;
			}
			return this.onFloor === 1;
		}
		
		getBounce(): number {
			return this.bounce;
		}
		
		hurt(damage:number): void {}
		
	}
	
}
