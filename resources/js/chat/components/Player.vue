<template>
	<div>
		<!-- <audio :src="foo(attach)" controls></audio> -->
		<button
			@click="player.play()"
			class="btn btn-lg bt-default">
			<i
				class="fa"
				:class="{
					'fa-pause-circle':isPlaying(),
					'fa-play-circle':!isPlaying(),
				}"
			></i>
		</button>
		<span>{{ currentTime }}</span> / <span>{{ duration }}</span>
	</div>
</template>
<script>
	export default {
		data: function() {
			return {
				player: new Audio(),
				playing: false,
				currentTime: '0.00',
				duration: 0,
			}
		},
		methods: {
			isPlaying: function() {
				return this.playing;
			},
			// currentTime: function() {
			// 	return this.player.currentTime;
			// },
			// duration: function() {
			// 	return this.player.duration;
			// },
			foo: function(attach) {
				return URL.createObjectURL(
					this.$b64toBlob(
						attach.split(',')[1]
					)
				);
			}
		},
		computed: {
			// playing: function() {
			// 	return this.player.playing;
			// }
		},
		created: function(){
			this.player.onplay = () => {
				this.playing = true;
			}
			this.player.onpause = () => {
				this.playing = false;
			}
			this.player.ontimeupdate = () => {
				this.currentTime = Math.ceil(this.player.currentTime * 100) / 100;
			}
			this.player.onloadeddata = () => {
				this.duration = Math.ceil(this.player.duration * 100) / 100;
			}
			this.player.src = this.foo(this.attach);
			// this.player.play();
		},
		props: {
			attach: String
		}
	}
</script>