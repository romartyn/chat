<template>
	<div>
		<div ref="chat_messsages" class="chat_messsages">
			<!-- <p v-for="(message,index) in messages">{{ message }}</p> -->
			<chat-message :key="index" :message="message" v-for="(message,index) in messages"></chat-message>
		</div>
		<textarea
			class="input_area"
			v-model="message.text"
			@paste="paste($event)"
			@keydown="input_area_keydown($event)"
		></textarea>
		<attaches :attaches="message.attaches"></attaches>
		<button class="btn btn-primary" @click="record">ЗАПИСЬ ЗВУКА</button>
	</div>
</template>

<script>
	import ChatMessage from "./components/ChatMessage";
	import Attaches from "./components/Attaches";
	export default {
		components: {
			ChatMessage,
			Attaches
		},
		data: function(){
			return {
				client: null,
				messages: [],
				message: this.new_message()
			}
		},
		methods: {
			record: function(){
				console.log('record!');
			},
			new_message: function(text,user_id){
				text = text || null;
				user_id = user_id !== undefined ? user_id : user.id;
				return {
					text,
					attaches: [],
					user_id: user_id
				};
			},
			input_area_keydown: function($event) {
				if($event.ctrlKey && $event.key == 'Enter'){
					this.client.send(JSON.stringify(this.message, null, 2));
					this.message = this.new_message();
				}
			},
			log: function() {
				this.messages.push(this.new_message(arguments[0] || null, null));
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
				};
				client.onclose = function() {
					app.log('echo-protocol Client Closed');
				};
				 
				client.onmessage = function(e) {
					console.log(e);

					if (typeof e.data === 'string') {
						let obj = JSON.parse(e.data);
						this.messages.push(obj);
					} else if (e.data instanceof Blob) {
						let imageBlob = e.data;
	
						// this.$blobToBase64(imageBlob,function(base64data){
						// 	console.log(base64data);
						// });

						this.$refs.chat_messsages.append(this.$imgFromBlob(imageBlob));
					}
				}.bind(this);

				this.client = client;
			},
			paste: function(thePasteEvent){
				let items = thePasteEvent.clipboardData.items;//console.log(items);

				if(items == undefined){
					return;
				};

				for (var i = 0; i < items.length; i++) {
					console.log(items[i]);
					// Skip content if not image
					if (items[i].type.indexOf("image") == -1){
						continue;
					}
					// Retrieve image on clipboard as blob
					var blob = items[i].getAsFile();

					this.$blobToBase64(blob,function(base64url){
						console.log(base64url);

						console.log(blob);

						// this.client.send(blob);
						this.message.attaches.push(base64url);

						console.log(this.message);
					}.bind(this));

				}
			}
		},
		created: function () {
			// console.log(user);
			// console.log(users);
			// return;
			try {
				this.ws();
			} catch (e) {
				console.log(e);
			}
		}
	}
</script>