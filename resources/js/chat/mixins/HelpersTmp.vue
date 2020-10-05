<script>
	export default {
		methods: {
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
		}
	}
</script>