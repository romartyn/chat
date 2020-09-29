<template>
	<div>
		<div ref="chat_messsages" class="chat_messsages">
			<p v-for="(message,index) in messages">{{ message }}</p>
		</div>
		<textarea @keydown="input_area_keydown($event)" class="input_area" v-model="message"></textarea>
	</div>
</template>

<style module>
	.chat_messsages {
		background-color: rgba(200,200,255,1);
		min-height: 300px;
		max-height: 300px;
		overflow-y: scroll;
	}
	.input_area {
		width: 100%;
	}
</style>

<script>
	export default {
		data: function(){
			return {
				messages: [],
				message: null,
				client: null
			}
		},
		methods: {
			input_area_keydown: function($event) {
				// console.log($event);
				if($event.ctrlKey && $event.key == 'Enter'){
					// console.log(this.message);
					// this.client.send(this.message);
					let obj = {
						text: this.message,
						user_id: user.id
					};
					// let blob = new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});
					// this.client.send(blob);
					this.client.send(JSON.stringify(obj, null, 2));
					this.message = null;
				}
			},
			log: function() {
				this.messages.push(arguments[0] || null);
				// console.log(this.$refs.chat_messsages.scrollHeight, this.$refs.chat_messsages.scrollTop);
				// console.dir(this.$refs.chat_messsages);
				setTimeout(() => {
					this.$refs.chat_messsages.scrollTop = this.$refs.chat_messsages.scrollHeight;
				},10);
			},
			ws: function () {
				let app = this;

				let W3CWebSocket = require('websocket').w3cwebsocket;
				
				let client;
				try { 
					client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');
				} catch (e) {
					app.log(e);
				}
				 
				client.onerror = function() {
				    app.log('Connection Error');
				};
				 
				client.onopen = function() {
				    app.log('WebSocket Client Connected');
				 
				    function sendNumber() {
				        if (client.readyState === client.OPEN) {
				            let number = Math.round(Math.random() * 0xFFFFFF);
				            client.send(number.toString());
				            setTimeout(sendNumber, 1000);
				        }
				    }
				    // sendNumber();
				};
				 
				client.onclose = function() {
				    app.log('echo-protocol Client Closed');
				};
				 
				client.onmessage = function(e) {
				    if (typeof e.data === 'string') {
				    	let obj = JSON.parse(e.data);
				    	let author = users.find(u => u.id == obj.user_id);
				        app.log(`${author.name}: '` + obj.text + "'");
				    }
				};

				this.client = client;
			}
		},
		created: function () {
			console.log(user);
			console.log(users);
			// return;
			try {
				this.ws();
			} catch (e) {
				console.log(e);
			}
		}
	}
</script>