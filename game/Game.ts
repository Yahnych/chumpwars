/// <reference path='Random.ts' />
/// <reference path='Entity.ts' />
/// <reference path='Map.ts' />
/// <reference path='MapGenerator.ts' />
/// <reference path='Weapon.ts' />

///<reference path='../defs/socket.io-client/socket.io-client.d.ts' />

module game {
	export var DT_PER_TICK = 0.02;
	export var MIN_SPEED = DT_PER_TICK * 2;
}

var socket:SocketIOClient.Socket;

window.onload = function () {
	var canvas = <HTMLCanvasElement> document.getElementById('c');
	var map = new game.Map(canvas);
	var gen = new game.MapGeneratorBasic(map);

	socket = io();

	socket.on('start_game', function (data) {
		console.log('starting game!');
		gen.seed = data.seed;
		gen.generate();
		map.render();
	});

};