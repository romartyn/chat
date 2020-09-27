import Vue from 'vue';
import {store} from './store/store.js';
import App from "./App.vue";
import Helpers from "./mixins/Helpers";
import { BootstrapVue } from 'bootstrap-vue';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);
Vue.use(BootstrapVue);
Vue.mixin(Helpers);

let application = new Vue({
	render: h => h(App), store
});

let chat_div = document.getElementById('chat');

if(chat_div){
	application.$mount("#chat");
} else {
	application.$swal('No place to mount App, please provide some div#chat', '', 'error');
}