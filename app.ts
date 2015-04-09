///<reference path='defs/node/node.d.ts' />
///<reference path='defs/express/express.d.ts' />
///<reference path='defs/socket.io/socket.io.d.ts' />

import express = require('express');
import http = require('http');
import path = require('path');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 

app.use(express.static('public')); 

var seed = Date.now() % 65536;
console.log('initialised with seed '+seed);

io.on('connection', function (client:SocketIO.Socket) {
	console.log('new connection from client  '+client.id);
	client.emit('start_game', {
		seed: seed
	});
});

server.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening at http://%s:%s', host, port); 
});
