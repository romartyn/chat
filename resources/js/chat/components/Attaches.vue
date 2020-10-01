<template>
	<div class="attaches row">
		<div class="attach col-xs-6 col-md-4 pb-4" v-for="attach in attaches">
			<img v-if="attach.match('image')" :src="attach">
			<div v-else>{{ attach }}</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			attaches: Array
		}
	}
</script>