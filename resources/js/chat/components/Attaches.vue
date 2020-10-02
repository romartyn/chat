<template>
	<div class="attaches row">
		<div class="attach col-xs-6 col-md-4 pb-4" v-for="attach in attaches">
			<img v-if="attach.match('image')" :src="attach">
			<audio v-if="attach.match('audio')" :src="foo(attach)" controls></audio>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			foo: function(attach) {
				return URL.createObjectURL(this.b64toBlob(attach.split(',')[1]));
			}
		},
		props: {
			attaches: Array
		}
	}
</script>