///<reference path='../Game.ts' />

module world {
	
	export class Map {
		canvas:HTMLCanvasElement;
		context:CanvasRenderingContext2D;
		data:ImageData;
		pixels:any; // Uint8ClampedArray or number[], it seems nobody can make their mind up
		
		dirty:{x1:number;y1:number;x2:number;y2:number};
		
		get width():number {
			return this.canvas.width;
		}
		get height():number {
			return this.canvas.height;
		}
		
		constructor(canvas:HTMLCanvasElement) {
			this.canvas = canvas;
			this.context = canvas.getContext('2d');
			this.data = this.context.createImageData(canvas.width, canvas.height);
			this.pixels = this.data.data;
		}
		
		render():void {
			this.context.putImageData(this.data, 0,0,
				this.dirty.x1, this.dirty.y1,     // source x,y
				this.dirty.x2-this.dirty.x1 + 1,  // source width
				this.dirty.y2-this.dirty.y1 + 1); // source height
			this.dirty = null;
		}
		
		private setDirty(x:number, y:number):void {
			if (this.dirty == null) {
				this.dirty = {x1:x, y1:y, x2:x, y2:y};
			} else {
				if (x < this.dirty.x1) this.dirty.x1 = x;
				else if (x > this.dirty.x2) this.dirty.x2 = x;
				if (y < this.dirty.y1) this.dirty.y1 = y;
				else if (y > this.dirty.y2) this.dirty.y2 = y;
			}
		}
		
		setPixel(x:number, y:number, r:number = 0, g:number = 0, b:number = 0, a:number = 255):void {
			if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
			var i = 4 * (x + y * this.width);
			this.pixels[i] = r;
			this.pixels[i + 1] = g;
			this.pixels[i + 2] = b;
			this.pixels[i + 3] = a;
			this.setDirty(x, y);
		}
		
		clearPixel(x:number, y:number):void {
			if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
			var i = 4 * (x + y * this.width);
			if (this.pixels[i + 3] != 0) {
				this.pixels[i + 3] = 0;
				this.setDirty(x, y);
			}
		}
		
		getPixel(x:number, y:number):[number,number,number,number] {
			if (x < 0 || y < 0 || x >= this.width || y >= this.height) return [0, 0, 0, 0];
			var i = 4 * (x + y * this.width);
			var r = this.pixels[i];
			var g = this.pixels[i + 1];
			var b = this.pixels[i + 2];
			var a = this.pixels[i + 3];
			return [r, g, b, a];
		}
		
		isSolid(x:number, y:number):boolean {
			if (x < 0 || y < 0 || x >= this.width || y >= this.height) return true;
			var i = 4 * (x + y * this.width);
			var a = this.pixels[i + 3];
			return a !== 0;
		}
		
		clearCircle(x:number, y:number, r:number):void {
			var rs = r * r;
			for (var i=-r; i<=r; i++) {
				for (var j=-r; j<=r; j++) {
					var dist = i*i + j*j;
					if (dist <= rs) this.clearPixel(x+i, y+j);
				}
			}
		}
	}
}