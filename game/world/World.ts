///<reference path='Map.ts' />
///<reference path='../entity/Entity.ts' />

module world {
	
	import Entity = entity.Entity;
	
	export class World {
		
		map: Map;
		// the main canvas to which entities are drawn (the map gets its own canvas)
		canvas: HTMLCanvasElement;
		context: CanvasRenderingContext2D;
		entities: Entity[] = [];
		addedEntities: Entity[] = [];
		removedEntities: Entity[] = [];
		
		get width():number {
			return this.canvas.width;
		}
		
		get height():number {
			return this.canvas.height;
		}
		
		constructor(mapCanvas:HTMLCanvasElement, entityCanvas:HTMLCanvasElement) {
			this.map = new Map(mapCanvas);
			this.canvas = entityCanvas;
			this.context = entityCanvas.getContext('2d');
		}
		
		add(e:Entity):void {
			this.addedEntities.push(e);
			e.world = this;
			e.added();
		}
		remove(e:Entity):void {
			this.removedEntities.push(e);
			e.removed();
			e.world = null;
		}
		
		tick():void {
			var entities = this.entities;
			entities.forEach(function (e:Entity) {
				e.tick();
			});
			
			if (this.removedEntities.length !== 0) {
				this.removedEntities.forEach(function (e:Entity) {
					var i = entities.indexOf(e);
					entities.splice(i, 1);
				});
				this.removedEntities = [];
			}
			
			if (this.addedEntities.length !== 0) {
				this.addedEntities.forEach(function (e:Entity) {
					entities.push(e);
				});
				this.addedEntities = [];
			}
		}
		
		setPixel(x:number, y:number, r:number = 0, g:number = 0, b:number = 0, a:number = 255):void {
			this.map.setPixel(x,y,r,g,b,a);
		}
		clearPixel(x:number, y:number):void {
			this.map.clearPixel(x, y);
		}
		getPixel(x:number, y:number):[number,number,number,number] {
			return this.map.getPixel(x, y);
		}
		isSolid(x:number, y:number):boolean {
			return this.map.isSolid(x, y);
		}
		
		render():void {
			if (this.map.dirty) {
				this.map.render();
			}
			this.context.clearRect(0, 0, this.width, this.height);
			this.entities.forEach(function (e:Entity) {
				e.render();
			});
		}
		
		explosion(x:number, y:number, r:number, damageFunction:Function, knockbackFunction:Function):void {
			this.map.clearCircle(x, y, r);
			this.entities.forEach(function (e:Entity) {
				damageFunction(e);
				knockbackFunction(e);
			});
		}
	}
}