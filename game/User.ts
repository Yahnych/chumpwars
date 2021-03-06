///<reference path='../defs/socket.io-client/socket.io-client.d.ts' />

module User {
	
	import Socket = SocketIOClient.Socket;
	
	export var name:string;

	function validName(str:string):boolean {
		return str && (/\w+/).test(str);
	}
	
	// if username doesn't exist, repeatedly prompt the user for a name.
	export function init() {
		
		var storedName:string = localStorage.getItem('name');

		while (!validName(storedName)) {
			storedName = prompt('enter your nickname');
		}
		
		localStorage.setItem('name', storedName)
		name = storedName;
	}

	export function register(socket:Socket) {
		socket.emit('user_info', {
			name: name
		});
	}
}