<template>
	<div class="row pb-2">
		<div class="col-xs-12 col-md-3 author">{{ author(message.user_id).name }}</div>
		<div class="col-xs-12 col-md-9 text">{{ message.text }}</div>
		<attaches :attaches="message.attaches"></attaches>
	</div>
</template>

<script>
	import Attaches from "./Attaches";
	export default {
		components: {
			Attaches
		},
		methods: {
			author: function(user_id){
				return users.find(u => u.id == user_id) || { user_id:0, name:'Журнал' };
			},
		},
		props: {
			message: Object
		}
	}
</script>