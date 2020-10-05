<template>
	<div class="attaches row">
		<div class="attach col-xs-6 col-md-3" v-for="attach in (attaches || message.attaches)"><!--  pb-4 -->
			<img style="max-width: 100%;" v-if="attach.match('image')" :src="attach">
			<player v-if="attach.match('audio')" :attach="attach"></player>
		</div>
	</div>
</template>

<script>
	import Player from "./Player";
	export default {
		components: {
			Player
		},
		computed: {
			message: function(){ return this.$store.state.message; },
		},
		props: {
			attaches: Array
		}
	}
</script>