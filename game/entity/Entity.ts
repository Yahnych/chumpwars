///<reference path='../Game.ts' />

module entity {
	
	export class Entity {
		
		world: World;
		x: number;
		y: number;
		width: number;
		height: number;
		velX: number = 0;
		velY: number = 0;
		gravity: number = 10.0;
		bounce: number = 0;
		
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
		
		//Check if an object collides with the map at the given position
		collide(x: number, y: number): boolean {
			//var oldX = this.x;
			//var oldY = this.y;
			//this.x = x;
			//this.y = y;
			// res = check collision
			//this.x = oldX;
			//this.y = oldY;
			for (var i=x; i<x+this.width; i++) {
				for (var j=y; j<y+this.height; j++) {
					if (this.world.isSolid(i, j)) {
						return true;
					}
				}
			}
				
			return false;
		}
		
		resolveMovementX(): void {
			var amount = Math.abs(this.velX) * Game.DT_PER_TICK;
			var sign = this.velX > 0 ? 1 : -1;
			
			while (amount >= 1) {
				this.x += sign;
				amount--;
				if (this.collide(this.x, this.y)) {
					this.velX *= -this.bounce;
					this.x -= sign;
					sign = -sign;
				}
			}
			
			/*amount *= sign; // does this work?
			
			var residue = this.x % 1;
			this.x += amount;
			if (sign == -1) {
				if (residue + amount <= 0) {
					if (this.collide(this.x, this.y)) {
						this.velX *= -this.bounce;
						this.x -= amount;
					}
				}
			} else {
				if (residue + amount >= 1) {
					if (this.collide(this.x, this.y)) {
						this.velX *= -this.bounce;
						this.x -= amount;
					}
				}
			}*/
		}
		
		resolveMovementY():void {
			var amount = Math.abs(this.velY) * Game.DT_PER_TICK;
			var sign = this.velY > 0 ? 1 : -1;
			
			while (amount >= 1) {
				this.y += sign;
				amount--;
				if (this.collide(this.x, this.y)) {
					this.velY *= -this.bounce;
					this.y -= sign;
					sign = -sign;
				}
			}
			
			/*amount *= sign; // ditto?
			
			var residue = this.y % 1;
			this.y += amount;
			if (sign == -1) {
				if (residue + amount <= 0) {
					if (this.collide(this.x, this.y)) {
						this.velY *= -this.bounce;
						this.y -= amount;
					}
				}
			} else {
				if(residue + amount >= 1) {
					if (this.collide(this.x, this.y)) {
						this.velY *= -this.bounce;
						this.y -= amount;
					}
				}
			}*/
		}
		
		tick(): void {
			this.velY += this.gravity * Game.DT_PER_TICK;
			this.resolveMovementX();
			var startY = this.y;
			this.resolveMovementY();
			console.log(startY, this.y, this.velY);
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
