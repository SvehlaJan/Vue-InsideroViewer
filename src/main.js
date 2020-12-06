import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {auth} from './firebase'
import * as VueGoogleMaps from 'vue2-google-maps'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from "axios";
import AsyncComputed from 'vue-async-computed'

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons)

Vue.use(VueGoogleMaps, {
    load: {
        key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    },
})

Vue.config.productionTip = false

const axiosConfig = {
    baseURL: ' https://api.insidero.com/v3',
    timeout: 30000,
};
Vue.prototype.$axios = axios.create(axiosConfig)

Vue.use(AsyncComputed)

let app
auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }

    if (user) {
        store.dispatch('fetchUserProfile', user)
    }
})