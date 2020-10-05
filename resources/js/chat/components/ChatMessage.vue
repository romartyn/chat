<template>
	<div class="row pb-2">
		<div class="col-xs-12 col-md-2 when">
			{{ $chatTime(message.time) }}
			<button class="btn btn-sm btn-default" v-if="editable(message)" @click="edit(message)">
				<i class="fa fa-edit"></i>
			</button>
		</div>
		<div class="col-xs-12 col-md-2 author">{{ author(message.user_id).name }}</div>
		<div class="col-xs-12 col-md-8 text">{{ message.text || '' }}</div>
		<div class="col-xs-12 col-md-12">
			<!-- <div class="row"> -->
				<attaches :attaches="message.attaches"></attaches>
			<!-- </div> -->
		</div>
	</div>
</template>

<script>
	import Attaches from "./Attaches";

	const dayjs = require('dayjs');

	const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
	dayjs.extend(isSameOrBefore);

	const maxLifeTime = 60;

	export default {
		components: {
			Attaches
		},
		computed: {
			user: function(){ return this.$store.state.user; },
			users: function(){ return this.$store.state.users; }
		},
		methods: {
			editable: function(message){
				return !!(message.uuid) &&
					(message.user_id === this.user.id) &&
					!!message.time &&
					dayjs().isSameOrBefore(
						dayjs(+message.time).add(maxLifeTime, 'second')
					)
			},
			edit: async function(message){
				if(this.editable(message)){
					await this.$store.dispatch("SET_MESSAGE", {...message});
				} else {
					message.uuid = null;
				}
			},
			author: function(user_id){
				return this.users.find(u => u.id == user_id) || { user_id: -1, name: 'Журнал' };
			},
		},
		created: function(){
			// setInterval(() => {
			// 	if(this.message.uuid && this.message.user_id === this.user.id){
			// 		console.log(this.editable(this.message));
			// 		// console.log(this.message);
			// 	}
			// },1000);
		},
		props: {
			message: Object
		}
	}
</script>