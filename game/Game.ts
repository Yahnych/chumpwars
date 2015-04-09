/// <reference path='util/Random.ts' />
/// <reference path='entity/Entity.ts' />
/// <reference path='world/World.ts' />
/// <reference path='world/Map.ts' />
/// <reference path='gen/PerlinGenerator.ts' />
/// <reference path='User.ts' />
/// <reference path='Chat.ts' />

///<reference path='../defs/socket.io-client/socket.io-client.d.ts' />

import World = world.World;
import PerlinGenerator = gen.PerlinGenerator;

module Game {
	export var DT_PER_TICK = 0.02;
	export var MIN_SPEED = DT_PER_TICK * 2;
}

window.onload = function () {
	var canvas = <HTMLCanvasElement> document.getElementById('c');
	var world = new World(canvas);
	var gen = new PerlinGenerator(world);

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
	
	socket.on('start_game', function (data) {
		console.log('starting game!');
		gen.generate(data.seed);
		
		var e = new entity.Entity(200, 100, 8, 8);
		world.add(e);
	});
	
	socket.on('connect_timeout', function () {
		Chat.print('connection timed out');
	});
	
	setInterval(function () {
		// really we need to pop from a buffer here this and only tick if there are input frames available from the server
		//world.tick();
	}, Game.DT_PER_TICK * 1000);
	
	setInterval(function () {
		world.render();
	}, 1000/30);
};