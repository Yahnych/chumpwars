/// <reference path='../../defs/noise/noise.d.ts' />
/// <reference path='../Game.ts' />
/// <reference path='../world/Map.ts' />
/// <reference path='../world/World.ts' />
/// <reference path='../util/Random.ts' />

module gen {
	
	import World = world.World;
	import Random = util.Random;
	
	export class PerlinGenerator {
		world:World;
		resolution = 7;    // how many islands are there
		threshold = 0.1;   // value above which the noise is considered ground
		spacing = 0.3;     // gaps between islands
		color = [255,255,0];
		
		constructor(world:World) {
			this.world = world;
		}
		
		private rollParams(rand:Random):void {
			this.resolution = rand.nextFloat() * 20 + 5;
			this.threshold = rand.nextFloat() * 0.2;
			this.spacing = rand.nextFloat() * 0.5;
			this.color = [
				rand.nextInt()%255,
				rand.nextInt()%255,
				rand.nextInt()%255,
			];
		}
		
		generate(seed:number):void {
			
			var rand = new Random(seed);
			this.rollParams(rand);
			noise.seed(seed);
			
			var map = this.world.map;
			var w = map.width;
			var h = map.height;
			var rx = this.resolution / w;
			var ry = this.resolution / h;
			
			for (var y=0; y<h; y++) {
				var fadey = Math.pow(y/h, 2);
				
				for (var x=0; x<w; x++) {
					var fadex = 1 - Math.pow((w/2 - x) / (w/2), 2);
					
					var n = Math.abs(noise.perlin2(x*rx, y*ry) + this.spacing);
					n *= fadex * fadey;
					if (n > this.threshold) {
						var r = (1-n) * this.color[0] | 0;
						var g = (1-n) * this.color[1] | 0;
						var b = (1-n) * this.color[2] | 0;
						map.setPixel(x, y, r,g,b);
					} else {
						map.clearPixel(x, y);
					}
				}
			}
		}
	}
	
}