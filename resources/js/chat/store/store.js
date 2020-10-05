import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

axios.defaults.headers.common = {
	'X-Requested-With': 'XMLHttpRequest',
	'X-CSRF-TOKEN': document.querySelector("meta[name='csrf-token']").getAttribute("content")
};

export const store = new Vuex.Store({
	state: {
		anonym: {id: 0, name: 'Anonym'},
		user: null,
		message: null,
		messages: null,
		users: []
	},
	mutations: {
		SET_USER:
			async (state, data) => {
				state.user = data;
			},
		SET_USERS:
			async (state, data) => {
				state.users = data;
			},
		SET_MESSAGE:
			async (state, data) => {
				state.message = data;
			},
		// SET_MESSAGES:
		// 	async (state, data) => {
		// 		state.messages = data;
		// 	},
	},
	actions: {
		FETCH_USER: async (context) => {
			await context.commit('SET_USER', user || context.state.anonym);
		},
		FETCH_USERS: async (context) => {
			users.push(context.state.anonym);	console.log(users);
			await context.commit('SET_USERS', users);
		},
		SET_MESSAGE: async (context, data) => {
			await context.commit('SET_MESSAGE', data);
		},
		// SET_MESSAGES: async (context, data) => {
		// 	await context.commit('SET_MESSAGES', data);
		// }
	}
});