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
		//
	},
	mutations: {
		//
	},
	actions: {
		//
	}
});