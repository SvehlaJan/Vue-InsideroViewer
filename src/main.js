import Vue from 'vue'
import App from './App.vue'
import {store} from './store'
import {router} from './router'
import {auth} from './firebase'
import * as VueGoogleMaps from 'vue2-google-maps'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from "axios";
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons)

Vue.use(VueGoogleMaps, {
    load: {
        key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    },
})

const axiosConfig = {
    baseURL: ' https://api.insidero.com/v3',
    timeout: 30000,
};
Vue.prototype.$axios = axios.create(axiosConfig)

Vue.use(VueLodash, {lodash: lodash})

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(async function (user) {
    if (user) {
        await store.dispatch('fetchUserProfile', user)
    }

    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App),
        }).$mount('#app')
    }
})