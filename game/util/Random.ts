module util {
	
	var RAND_MAX = 0x7fffffff | 0;
	var RAND_MIN = 0x80000000 | 0;
	
	export class Random {
		
		// XORShift random number generator based on George Marsaglia's paper
		// http://www.jstatsoft.org/v08/i14/paper
		
		x:number;
		y:number = 362436069;
		z:number = 521288629;
		w:number = 88675123;
		
		constructor(seed: number = Date.now()) {
			this.x = seed | 0;
		}
		
		// get a random 32-bit integer
		nextInt(): number {
			var t = this.x ^ (this.x << 11);
			this.x = this.y;
			this.y = this.z;
			this.z = this.w;
			this.w = this.w ^ (this.w >> 19) ^ t ^ (t >> 8);
			return this.w;
		}
		
		// get a number between 0.0 and 1.0
		nextFloat(): number {
			return Math.abs(this.nextInt()) / RAND_MAX;
		}
		
		nextBoolean(): boolean {
			return this.nextInt() % 2 == 1;
		} 
	}
	
}