///<reference path='Game.ts' />

module game {

	export class Entity {

		x: number;
		y: number;
		width: number;
		height: number;
		velX: number;
		velY: number;
		bounce: number;
		removed: boolean = false;

		/**
		 * Check if an object collides with the map at the given position
		 */
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

		resolveMovementX(): void {
			var amount = Math.abs(this.velX);
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

			amount *= sign; // does this work?

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
			}
		}

		resolveMovementY():void {
			var amount = Math.abs(this.velY);
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

			amount *= sign; // ditto?

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
			}
		}

		tick(): void {
			this.resolveMovementX();
			this.resolveMovementY();
		}

		isAtRest(): boolean {
			//return Math.abs(this.velX) < 0.01 && Math.abs(this.velY) < 0.01;
			return Math.abs(this.velX) < game.MIN_SPEED && Math.abs(this.velY) < game.MIN_SPEED;
		}

	}

}
