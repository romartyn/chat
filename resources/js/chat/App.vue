<template>
	<div class="chat-messsages">..</div>
</template>

<style module>
	.chat-messsages {
		background-color: rgba(200,200,255,1);
		min-height: 300px;
		max-height: 300px;
	}
</style>

<script>
	export default {
		methods: {
			ws: function () {
				var W3CWebSocket = require('websocket').w3cwebsocket;
				 
				var client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');
				 
				client.onerror = function() {
				    console.log('Connection Error');
				};
				 
				client.onopen = function() {
				    console.log('WebSocket Client Connected');
				 
				    function sendNumber() {
				        if (client.readyState === client.OPEN) {
				            var number = Math.round(Math.random() * 0xFFFFFF);
				            client.send(number.toString());
				            setTimeout(sendNumber, 1000);
				        }
				    }
				    sendNumber();
				};
				 
				client.onclose = function() {
				    console.log('echo-protocol Client Closed');
				};
				 
				client.onmessage = function(e) {
				    if (typeof e.data === 'string') {
				        console.log("Received: '" + e.data + "'");
				    }
				};
			}
		},
		created: function () {
			console.log(user);
			this.ws();
		}
	}
</script>