<template>
	<div>
		<div ref="chat_messsages" class="chat_messsages container pt-2">
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

		<!-- <audio ref="player" controls></audio> -->
	</div>
</template>

<script>
	import ChatMessage from "./components/ChatMessage";
	import Attaches from "./components/Attaches";
	import { record } from "vmsg";

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
				var gumStream; 						//stream from getUserMedia()
				var recorder; 						//WebAudioRecorder object
				var input; 							//MediaStreamAudioSourceNode  we'll be recording
				var encodingType; 					//holds selected encoding for resulting audio (file)
				var encodeAfterRecord = true;       // when to encode
				var constraints = { audio: true, video:false };
				var audioContext; //new audio context to help us record

				navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
					audioContext = new AudioContext();
					gumStream = stream;
					input = audioContext.createMediaStreamSource(stream);
					encodingType = 'mp3';

					recorder = new WebAudioRecorder(input, {
						workerDir: "/assets/js/", // must end with slash
						encoding: encodingType,
						numChannels:2, //2 is the default, mp3 encoding supports only 2
						onEncoderLoading: function(recorder, encoding) {
							// show "loading encoder..." display
							console.log("Loading "+encoding+" encoder...");
						},
						onEncoderLoaded: function(recorder, encoding) {
							// hide "loading encoder..." display
							console.log(encoding+" encoder loaded");
						}
					});

					recorder.onComplete = function(recorder, blob) {
						console.log("Encoding complete");

						var url = URL.createObjectURL(blob);
						console.log(blob,url);
						// this.$refs.player.src = url;
						// this.$refs.player.play();

						this.$blobToBase64(blob,function(base64url){
							// base64url = base64url.replace('audio/mp3','audio/mpeg');
							let base64data = base64url.split(',')[1];
							let blobFromBase64 = this.b64toBlob(base64data);
							// console.log(
							// 	base64url,
							// 	blobFromBase64
							// );
							var _url = URL.createObjectURL(blobFromBase64);
							this.message.attaches.push(base64url);

							// this.$refs.player.src = _url;
							// this.$refs.player.play();
						}.bind(this));
					}.bind(this);

					recorder.setOptions({
						timeLimit:120,
						encodeAfterRecord:encodeAfterRecord,
						ogg: {quality: 0.5},
						mp3: {bitRate: 160}
					});

					recorder.startRecording();

					setTimeout(() => {
						recorder.finishRecording();
					},10000);
				}.bind(this)).catch(function(err) {
					console.warn(err);
				});
			},
			record_: function(){
				console.log('record!');

				const MicRecorder = require('mic-recorder-to-mp3');

				// New instance
				const recorder = new MicRecorder({
					bitRate: 128
				});
				 
				// Start recording. Browser will request permission to use your microphone.
				recorder.start().then(() => {
					console.log('then');
				}).catch((e) => {
					console.error(e);
				});
				 
				setTimeout(() => {
					// Once you are done singing your best song, stop and get the mp3.
					recorder
					.stop()
					.getMp3().then(([buffer, blob]) => {
						console.log(buffer, blob);
						// do what ever you want with buffer and blob
						// Example: Create a mp3 file and play
						const file = new File(buffer, 'me-at-thevoice.mp3', {
							type: blob.type,
							lastModified: Date.now()
						});

						this.$blobToBase64(blob,function(base64url){
							base64url = base64url.replace('audio/mp3','audio/mpeg');
							console.log(base64url);
							this.message.attaches.push(base64url);

							this.$refs.player.src = URL.createObjectURL(base64url);
							console.log(this.$refs.player.volume);
							this.$refs.player.play();
						}.bind(this));
					 
						// const player = new Audio(URL.createObjectURL(file));
						// player.play();
						// this.client.send(blob);

						// this.$refs.player.src = URL.createObjectURL(file);
						// console.log(this.$refs.player.volume);
						// this.$refs.player.play();
					}).catch((e) => {
						alert('We could not retrieve your message');
						console.log(e);
					});
				},5000);
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
					let json = JSON.stringify(this.message);
					console.log({l:json.length});
					this.client.send(json);
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
					// console.log(e.data);

					if (typeof e.data === 'string') {
						let obj = JSON.parse(e.data);
						this.messages.push(obj);
					} /*else if (e.data instanceof Blob) {
						let imageBlob = e.data;

						this.$refs.chat_messsages.append(this.$imgFromBlob(imageBlob));
					}*/
				}.bind(this);

				this.client = client;
			},
			paste: function(thePasteEvent){
				let items = thePasteEvent.clipboardData.items;//console.log(items);

				if(items == undefined){
					return;
				};

				for (var i = 0; i < items.length; i++) {
					// console.log(items[i]);
					// Skip content if not image
					if (items[i].type.indexOf("image") == -1){
						continue;
					}
					// Retrieve image on clipboard as blob
					var blob = items[i].getAsFile();

					this.$blobToBase64(blob,function(base64url){
						// console.log(base64url);
						// console.log(blob);

						// this.client.send(blob);
						this.message.attaches.push(base64url);

						// console.log(this.message);
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