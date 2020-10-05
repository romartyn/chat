<template>
	<div>
		<div
			ref="chat_messsages"
			class="chat_messsages container pt-2"
		>
			<chat-message
				:key="index"
				:message="message"
				v-for="(message,index) in messages"
			></chat-message>
		</div>
		<div class="container">
			<div class="row">
				<textarea
					class="col-xs-8 col-md-8 input_area form-control"
					v-model="message.text"
					v-if="message"
					@paste="paste($event)"
					@keydown="input_area_keydown($event)"
				></textarea>
				<button
					class="btn btn-primary col-xs-2 col-md-2"
					style="font-size: x-large;"
					@click="send"
				>
					<i class="fas fa-paper-plane"></i>
				</button>
				<button
					class="btn btn-primary col-xs-2 col-md-2"
					:class="{'btn-danger': !!recorder}"
					style="font-size: x-large;"
					@click="record"
				>
					<i class="fas fa-microphone"></i>
				</button>
			</div>
		</div>

		<!-- <attaches
			v-if="message"
			:attaches="message.attaches"
		></attaches> -->
	</div>
</template>

<script>
	import Vue from 'vue';
	import ChatMessage from "./components/ChatMessage";
	import Attaches from "./components/Attaches";
	import { record } from "vmsg";
	import voice from './components/voice.js';

	export default {
		components: {
			ChatMessage,
			Attaches
		},
		data: function(){
			return {
				client: null,
				messages: [],
				recorder: null
			}
		},
		watch: {
			messages: function(newValue){
				// console.log(newValue.map(m => { return {...m}; }));
				setTimeout(() => {
					this.$refs.chat_messsages.scrollTop = this.$refs.chat_messsages.scrollHeight;
				},10);
			}
		},
		methods: {
			record: function(){
				if(this.recorder){
					this.recorder.finishRecording();
					this.recorder = null;
					return;
				}

				voice.recorder((recorder) => {
					this.recorder = recorder;
				}, (blob) => {
					this.$blobToBase64(blob, (base64url) => {
						let base64data = base64url.split(',')[1];
						let blobFromBase64 = this.$b64toBlob(base64data);

						this.message.attaches.push(base64url);
					});
				}, (err) => {
					this.log(err);
				}, 10000);
			},
			new_message: function(text,user_id){
				text = text || null;
				user_id = user_id !== undefined ? user_id : this.user.id;
				return {
					text,
					attaches: [],
					user_id: user_id,
					time: +(new Date())
				};
			},
			input_area_keydown: function($event) {
				if($event.ctrlKey && $event.key == 'Enter'){
					this.send();
				}
			},
			send: async function() {
				// console.log(this.message.attaches.map(a => { return {...a}; }));
				/* TODO: try to send attaches separatly, singed createWriter
				with https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry/createWriter */
				// this.message.attaches.forEach(async a => {
				// 	let signature = a.blob.type.padEnd(32);
				// 	let singedBlob = signature + a.blob;
				// 	console.log(
				// 		signature,
				// 		singedBlob,
				// 		a.blob
				// 	);
				// 	await this.client.send(singedBlob);
				// });
				/*{
					text: this.message.text,
					user_id: this.message.user_id
				}*/
				let json = JSON.stringify(this.message);
				this.client.send(json);

				await this.$store.dispatch("SET_MESSAGE", this.new_message());
			},
			log: function() {
				this.messages.push(this.new_message(arguments[0] || null, null));
			},
			ws: function () {
				let app = this;

				let W3CWebSocket = require('websocket').w3cwebsocket;

				let client;
				try {
					let query = this.$buildQueryString({
						user_id: this.user.id,
						user_name: this.user.name,
					});
					client = new W3CWebSocket('ws://localhost:8080/?'+query, 'echo-protocol');
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
				client.onmessage = async (incoming) => {
					if (typeof incoming.data === 'string') {
						let message = JSON.parse(incoming.data);

						console.log(message);
						if(message.messages){
							message.messages.forEach(m => this.messages.push(m));
							return;
						}
						if(message.users && message.users.length){
							await this.$store.commit('SET_USERS', message.users);
							return;
						}

						if(message.edit){
							let _message = this.messages.find(m => m.uuid == message.uuid);
							console.log(_message);
							_message.text = message.text;
							message.edit = false;
						} else {
							this.messages.push(message);					
						}
					} /*else if (incoming.data instanceof Blob) {
						let blobFromServer = incoming.data;
						console.log(blobFromServer);
					}*/
				};

				this.client = client;
			},
			paste: function(thePasteEvent){
				const items = thePasteEvent.clipboardData.items;

				if(items == undefined){
					return;
				};

				for (let i = 0; i < items.length; i++) {
					if (items[i].type.indexOf("image") == -1){
						continue;
					}

					const file = items[i].getAsFile();

					this.$blobToBase64(file, function(base64url){
						this.message.attaches.push(base64url);
					}.bind(this));
				}
			}
		},
		computed: {
			message: function(){ return this.$store.state.message; },
			user: function(){ return this.$store.state.user; },
			users: function(){ return this.$store.state.users; }
		},
		created: async function () {
			await this.$store.dispatch("FETCH_USER");
			await this.$store.dispatch("FETCH_USERS");
			await this.$store.dispatch("SET_MESSAGE", this.new_message());

			new Vue({
				render: h => h(Attaches),
				store: this.$store,
			}).$mount("#attaches");

			try {
				this.ws();
			} catch (e) {
				console.log(e);
			}
		}
	}
</script>