/// <reference path='../Keys.ts' />
/// <reference path='../entity/Worm.ts' />
/// <reference path='../entity/BazookaProjectile.ts' />

module weapon
{
	import Worm = entity.Worm;
	import Tick = Keys.Tick;
	import BazookaProjectile = entity.BazookaProjectile;
	
	export class Bazooka extends Weapon {
		private aimAngle = 0;
		private fireStrength = 0;
		private fireState = -1;
		
		handleControls(worm:Worm, keys:Tick):void {
			if (this.fireState != 1) {
				var changeNum = 0;
				if (keys.keyHeld(Keys.UP)) changeNum++;
				if (keys.keyHeld(Keys.DOWN)) changeNum--;
				this.aimAngle += changeNum;
				if (this.aimAngle < -80) this.aimAngle = -80;
				if (this.aimAngle > 80) this.aimAngle = 80;
			}
			if (this.fireState == 0) {
				if (!keys.keyHeld(Keys.FIRE)) {
					//this.fireState = 1;
					this.fireState = -1;
					var proj = new BazookaProjectile(worm.x+worm.width/2+1, worm.y+worm.height/2+1, 2, 2);
					var newAngle = -this.aimAngle;
					newAngle = newAngle * Math.PI / 180;
					var x = Math.cos(newAngle) * this.fireStrength * 7 * worm.lastFacing;
					var y = Math.sin(newAngle) * this.fireStrength * 7;
					proj.velX = x;
					proj.velY = y;
					console.log(x + ":" + y);
					worm.world.add(proj);
					this.fireStrength = 0;
				}
			}
			if (this.fireState == -1) {
				if (keys.keyHeld(Keys.FIRE)) this.fireState = 0;
			}
		}
		allowWormControl():boolean {
			return this.fireState == -1;
		}
		numUsesLeft():number {
			return 1;
		}
		reset():void {
			this.fireState = -1;
			this.fireStrength = 0;
			this.aimAngle = 0;
		}
		render(worm:Worm):void {
			worm.world.context.fillStyle = "RED";
			var newAngle = -this.aimAngle;
			newAngle = newAngle * Math.PI / 180;
			var x = worm.x + worm.width/2;
			x += Math.cos(newAngle) * 30 * worm.lastFacing;
			var y = worm.y + worm.height/2;
			y += Math.sin(newAngle) * 30;
			//worm.world.context.fillRect(Math.round(x), Math.round(y), 1, 1);
			worm.world.context.drawImage(Game.aim, Math.round(x)-15, Math.round(y)-15);
		}
		tick(worm:Worm):void {
			if (this.fireState == 0) this.fireStrength++;
			if (this.fireStrength == 90) {
				//this.fireState = 1;
				this.fireState = -1;
				var proj = new BazookaProjectile(worm.x+worm.width/2+1, worm.y+worm.height/2+1, 2, 2);
				var newAngle = -this.aimAngle;
				newAngle = newAngle * Math.PI / 180;
				var x = Math.cos(newAngle) * this.fireStrength * 7 * worm.lastFacing;
				var y = Math.sin(newAngle) * this.fireStrength * 7;
				proj.velX = x;
				proj.velY = y;
				console.log(x + ":" + y);
				worm.world.add(proj);
				this.fireStrength = 0;
			}
		}
	}
}