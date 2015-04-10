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
		
		constructor(x = 0, y = 0, width = 0, height = 0) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}
		
		// Called when the entity is added to the world
		added(): void {}
		
		// Called when the entity is removed from the world
		removed():void {}
		
		collide(x: number, y: number): boolean {
			var oldX = this.x;
			var oldY = this.y;
			this.x = x;
			this.y = y;
			// res = check collision
			this.x = oldX;
			this.y = oldY;
			return false;
		}
		
		//Check if an object collides with the map at the given position
		collideMap(x=this.x, y=this.y): boolean {
			for (var i=x; i<x+this.width; i++) {
				for (var j = y; j < y + this.height; j++) {
					if (this.world.isSolid(i, j)) {
						return true;
					}
				}
			}
			return false;
		}
		
		
		private residueX = 0;
		private residueY = 0;
		
		resolveMovementX(dx:number): void {
			this.residueX += dx;
			dx = Math.round(this.residueX);
			this.residueX -= dx;
			
			var sign = dx > 0 ? 1 : -1;
			
			while (dx != 0) {
				if (this.collideMap(this.x+sign, this.y)) {
					this.velX *= -this.bounce;
					break;
				}
				this.x += sign;
				dx -= sign;
			}
		}
		
		resolveMovementY(dy:number):void {
			this.residueY += dy;
			dy = Math.round(this.residueY);
			this.residueY -= dy;
			
			var sign = dy > 0 ? 1 : -1;
			
			while (dy != 0) {
				if (this.collideMap(this.x, this.y+sign)) {
					this.velY *= -this.bounce;
					break;
				}
				this.y += sign;
				dy -= sign;
			}
		}
		
		tick(): void {
			this.velY += this.gravity * Game.DT_PER_TICK;
			this.resolveMovementX(this.velX * Game.DT_PER_TICK);
			this.resolveMovementY(this.velY * Game.DT_PER_TICK);
		}
		
		render():void {
			var c = this.world.context;
			c.fillRect(this.x, this.y, this.width, this.height);
		}
		
		isAtRest(): boolean {
			//return Math.abs(this.velX) < 0.01 && Math.abs(this.velY) < 0.01;
			return Math.abs(this.velX) < Game.MIN_SPEED && Math.abs(this.velY) < Game.MIN_SPEED;
		}
		
	}
	
}
