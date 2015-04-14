/// <reference path='../Keys.ts' />
/// <reference path='../entity/Worm.ts' />

module weapon
{
	import Worm = entity.Worm;
	import Tick = Keys.Tick;
	
	export class Weapon {
		handleControls(worm:Worm, keys:Tick):void {}
		allowWormControl():boolean {
			return true;
		}
		numUsesLeft():number {
			return 0;
		}
		reset():void {}
		render(worm:Worm):void {}
		tick(worm:Worm):void {}
	}
}