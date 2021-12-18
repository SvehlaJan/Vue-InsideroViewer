import Vue from 'vue'
import VueRouter from 'vue-router'
import OffersList from "@/components/OffersList";
import {auth} from '@/firebase'
import {store} from '@/store'
import _ from "lodash";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: OffersList,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/offers',
        name: 'Dashboard',
        component: OffersList,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../pages/Login.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import(/* webpackChunkName: "settings" */ '../pages/Settings.vue'),
        meta: {
            requiresAuth: true
        }
    },
]

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    // linkActiveClass,
    routes
})

// navigation guard to check for logged in users
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
    const isLoggedIn = auth.currentUser != null;

    // console.log("Requires auth: ", requiresAuth, "Logged in: ", isLoggedIn)
    if (requiresAuth && !isLoggedIn) {
        next('/login');
        return;
    }

    if (to.path === '/' && isLoggedIn) {
        if (store.getters.hasSavedLocations) {
            const firstLocation = store.getters.savedLocationsArray[0];
            const propertyType = store.getters.propertyType;
            const query = {
                country: firstLocation.country?.value,
                region: firstLocation.region?.value,
                city: firstLocation.city?.value,
                neighborhood: firstLocation.neighborhood?.value,
                type: propertyType,
            };
            Object.keys(query).forEach((key) => (query[key] == null || query[key] === undefined) && delete query[key]);
            next({
                path: '/offers',
                query: query,
            })
        } else {
            next('/settings')
        }
    } else if (to.path === '/offers' && (!to.query.active || !to.query.type)) {
        let query = to.query
        query["active"] = query.active || "all"
        query["type"] = query.type || "all"
        next({
            path: to.path,
            query: query,
        })
    } else {
        next()
    }
})
