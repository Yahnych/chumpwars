// web worker to send out a message every x seconds

// this can be used as an alternative to setInterval, which would normally be paused when the user tabs out

onmessage = function (e) {
	setInterval(function () {
		postMessage(null);
	}, e.data * 1000)
};
