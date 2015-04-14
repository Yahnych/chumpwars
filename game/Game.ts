/// <reference path='util/Random.ts' />
/// <reference path='entity/Entity.ts' />
/// <reference path='entity/Worm.ts' />
/// <reference path='world/World.ts' />
/// <reference path='world/Map.ts' />
/// <reference path='gen/PerlinGenerator.ts' />
/// <reference path='User.ts' />
/// <reference path='Chat.ts' />
/// <reference path='Keys.ts' />
/// <reference path='weapon/Weapon.ts' />

///<reference path='../defs/socket.io-client/socket.io-client.d.ts' />

import World = world.World;
import PerlinGenerator = gen.PerlinGenerator;

module Game {
	export var TICK_RATE = 60;
	export var DT_PER_TICK = 1/TICK_RATE;
	export var MIN_SPEED = DT_PER_TICK * 2;
	
	export var aim:HTMLImageElement;
}

window.onload = function () {
	var mapCanvas = <HTMLCanvasElement> document.getElementById('map-canvas');
	var entityCanvas = <HTMLCanvasElement> document.getElementById('entity-canvas');
	var world = new World(mapCanvas, entityCanvas);
	var gen = new PerlinGenerator(world);
	
	Game.aim = <HTMLImageElement> document.getElementById('aim');

	Chat.init();
	User.init();
	if (!User.name) {
		Chat.print('error, no username specified');
		return;
	}
	
	var socket = io({
		reconnection: false
	});
	User.register(socket);
	Chat.register(socket);
	Keys.register(socket);
	
	var e = new entity.Worm(200, 100);
	
	socket.on('start_game', function (data) {
		console.log('starting game!');
		gen.generate(data.seed);
		world.add(e);
	});
	
	socket.on('connect_timeout', function () {
		Chat.print('connection timed out');
	});
	
	var update = function () {
		if (Keys.hasTick()) {
			var tick = Keys.popTick();
			if (e.isOnFloor()) e.velX = 0;
			e.currentWeapon.handleControls(e, tick);
			if (e.canControl()) {
				if (tick.keyHeld(Keys.LEFT)) {
					if (e.isOnFloor()) e.velX = -50;
					else e.velX -= 1;
				}
				if (tick.keyHeld(Keys.RIGHT)) {
					if (e.isOnFloor()) e.velX = 50;
					else e.velX += 1;
				}
				if (tick.keyHeld(Keys.JUMP) && e.isOnFloor()) e.velY = -100;
			}
			
			world.tick();
		}
	};
	
	try {
		var timer = new Worker('timer.js');
		timer.postMessage(Game.DT_PER_TICK);
		timer.onmessage = update;
	} catch (e) {
		setInterval(update, Game.DT_PER_TICK * 1000);
	}
	
	if (requestAnimationFrame) {
		var render = function() {
			world.render();
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);
	} else {
		setInterval(world.render, 30);
	}
};