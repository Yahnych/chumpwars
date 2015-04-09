/// <reference path='../defs/noise/Noise.d.ts' />
/// <reference path='Game.ts' />
/// <reference path='Map.ts' />
/// <reference path='Random.ts' />

module game {
	
	export class MapGenerator {
		
		map: Map;
		
		constructor(map:Map) {
			this.map = map;
		}
		generate():void {}
	}
	
	export class MapGeneratorBasic extends MapGenerator {
		
		seed = 0;
		resolution = 7;    // how many islands are there
		threshold = 0.1;   // value above which the noise is considered ground
		spacing = 0.3;     // gaps between islands
		color = [255,255,0];
		
		constructor(map:Map) {
			super(map);
		}
		
		private rollParams():void {
			noise.seed(this.seed);
			var rand = new game.Random(this.seed);
			this.resolution = rand.nextFloat() * 20 + 5;
			this.threshold = rand.nextFloat() * 0.2;
			this.spacing = rand.nextFloat() * 0.5;
			this.color = [
				rand.nextInt()%255,
				rand.nextInt()%255,
				rand.nextInt()%255,
			];
		}
		
		generate():void {
			this.rollParams();
			var w = this.map.width;
			var h = this.map.height;
			var rx = this.resolution / w;
			var ry = this.resolution / h;
			
			for (var y=0; y<h; y++) {
				var fadey = Math.pow(y/h, 2);
				
				for (var x=0; x<w; x++) {
					var fadex = 1 - Math.pow((w/2 - x) / (w/2), 2);
					
					var n = Math.abs(noise.perlin2(x*rx, y*ry) + this.spacing);
					n *= fadex * fadey;
					//this.map.setPixel(x, y, c,c,c);
					if (n > this.threshold) {
						var r = (1-n) * this.color[0] | 0;
						var g = (1-n) * this.color[1] | 0;
						var b = (1-n) * this.color[2] | 0;
						this.map.setPixel(x, y, r,g,b);
					} else {
						this.map.clearPixel(x, y);
					}
				}
			}
		}
	}
	
}