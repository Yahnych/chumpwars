///<reference path='../Game.ts' />

module world {
	
	export class Map {
		
		context:CanvasRenderingContext2D;
		data:ImageData;
		pixels:number[]; // Uint8ClampedArray
		
		get width():number {
			return this.data.width;
		}
		
		get height():number {
			return this.data.height;
		}
		
		constructor(context:CanvasRenderingContext2D, width:number, height:number) {
			this.context = context;
			this.data = context.createImageData(width, height);
			this.pixels = this.data.data;
		}
		
		setPixel(x:number, y:number, r:number = 0, g:number = 0, b:number = 0, a:number = 255):void {
			var i = 4 * (x + y * this.width);
			this.pixels[i] = r;
			this.pixels[i + 1] = g;
			this.pixels[i + 2] = b;
			this.pixels[i + 3] = a;
		}
		
		clearPixel(x:number, y:number):void {
			var i = 4 * (x + y * this.width);
			this.pixels[i] = 0;
			this.pixels[i + 1] = 0;
			this.pixels[i + 2] = 0;
			this.pixels[i + 3] = 0;
		}
		
		getPixel(x:number, y:number):[number,number,number,number] {
			var i = 4 * (x + y * this.width);
			var r = this.pixels[i];
			var g = this.pixels[i + 1];
			var b = this.pixels[i + 2];
			var a = this.pixels[i + 3];
			return [r, g, b, a];
		}
		
		isSolid(x:number, y:number):boolean {
			var i = 4 * (x + y * this.width);
			var a = this.pixels[i + 3];
			return a != 0;
		}
		
		render():void {
			this.context.putImageData(this.data, 0, 0);
		}
		
	}
}