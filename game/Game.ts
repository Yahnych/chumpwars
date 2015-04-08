/// <reference path='Random.ts' />
/// <reference path='Entity.ts' />
/// <reference path='Map.ts' />
/// <reference path='MapGenerator.ts' />
/// <reference path='Weapon.ts' />

module game {
	export var DT_PER_TICK = 0.02;
	export var MIN_SPEED = DT_PER_TICK * 2;
}

window.onload = function () {
	console.log('hello world!');
	
	var canvas = <HTMLCanvasElement> document.getElementById('c');
	var map = new game.Map(canvas);
	
	var gen = new game.MapGeneratorBasic(map);
	gen.seed = Date.now() % 65535;
	gen.generate();
	
	map.render();
};