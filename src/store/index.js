import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import {router} from '@/router'
import axios from 'axios'
import _ from 'lodash'


Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userProfile: {},
        allRawOffers: {},
        rawOffers: {offers: {}},
        offersLoading: false,
        selectedOffer: {},


        locationSearchCountries: [],
        locationSearchRegions: [],
        locationSearchCities: [],
        locationSearchNeighborhoods: [],
    },
    mutations: {
        setUserProfile(state, val) {
            console.log("setting user profile:", val)
            // state.userProfile = val
            Vue.set(state, 'userProfile', val)
        },
        setRawOffers(state, val) {
            // console.log("setting raw offers:", val)
            state.rawOffers = val
            // Vue.set(state, 'rawOffers', val)
        },
        setSelectedOffer(state, val) {
            // console.log("setting selected offer:", val)
            state.selectedOffer = val
        },
        setOffersLoading(state, val) {
            // console.log("setting offers loading:", val)
            state.offersLoading = val
        },
        setLocationSearchCountries(state, val) {
            // console.log("setting location search results:", val)
            Vue.set(state, 'locationSearchCountries', val)
        },
        setLocationSearchRegions(state, val) {
            // console.log("setting location search regions results:", val)
            Vue.set(state, 'locationSearchRegions', val)
        },
        setLocationSearchCities(state, val) {
            // console.log("setting location search cities results:", val)
            Vue.set(state, 'locationSearchCities', val)
        },
        setLocationSearchNeighborhoods(state, val) {
            // console.log("setting location search neighborhoods results:", val)
            Vue.set(state, 'locationSearchNeighborhoods', val)
        },
    },
    actions: {
        async signInAnonymously({dispatch}) {
            const {user} = await fb.auth.signInAnonymously()
            await fb.usersCollection.doc(user.uid).set({
                apiKey: '',
                userLocations: [],
                offersHistory: [],
            })
            dispatch('fetchUserProfile', user)
        },
        async signInWithEmailAndPassword({dispatch}, form) {
            const {user} = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
            dispatch('fetchUserProfile', user)
        },
        async signUpWithEmailAndPassword({dispatch}, form) {
            const {user} = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
            await fb.usersCollection.doc(user.uid).set({
                apiKey: '',
                userLocations: [],
                offersHistory: [],
            })
            dispatch('fetchUserProfile', user)
        },
        async createAccountForAnonymousUser({dispatch}, form) {
            const credential = fb.authNamespace.EmailAuthProvider.credential(form.email, form.password);
            const {user} = await fb.auth.currentUser.linkWithCredential(credential)
            dispatch('fetchUserProfile', user)
        },
        async changeUserPassword({dispatch, state}, form) {
            const credential = fb.authNamespace.EmailAuthProvider.credential(fb.auth.currentUser.email, form.currentPassword)
            await fb.auth.currentUser.reauthenticateWithCredential(credential)

            // await fb.auth.currentUser.updatePassword(form.newPassword)
        },
        async fetchUserProfile({commit}, user) {
            const userProfile = await fb.usersCollection.doc(user.uid).get()
            const userAuth = fb.auth.currentUser;

            commit('setUserProfile', {...userProfile.data(), isAnonymous: userAuth.isAnonymous})
            if (router.currentRoute.path === '/login') {
                await router.push('/')
            }
        },
        async logout({commit}) {
            await fb.auth.signOut()
            commit('setUserProfile', {})
            await router.push('/login')
        },
        async updateProfile({dispatch}, user) {
            const userId = fb.auth.currentUser.uid
            const userRef = await fb.usersCollection.doc(userId).update(user)

            dispatch('fetchUserProfile', {uid: userId})
        },
        async setSelectedOffer({commit}, offer) {
            commit('setSelectedOffer', offer);
        },
        async updateOfferCategory({dispatch, state}, payload) {
            const offersHistory = state.userProfile.offersHistory || [];

            const newEntry = {offerId: payload.offer.id, category: payload.category};
            const index = offersHistory.findIndex((e) => e.offerId === newEntry.offerId);
            if (index === -1) {
                offersHistory.push(newEntry);
            } else {
                offersHistory[index] = newEntry;
            }

            await dispatch('updateProfile', {offersHistory: offersHistory})
        },
        async fetchOffers({commit, state}, query) {
            if (query != null && state.userProfile?.apiKey) {
                commit('setOffersLoading', true)

                const params = {
                    api_key: state.userProfile.apiKey,
                    country: query.country,
                    region: query.region,
                    city: query.city,
                    neighborhood: query.neighborhood,
                    type: query.type,
                    active: query.active,
                    offer: "sell",
                }
                Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
                const paramsStr = new URLSearchParams(params).toString();
                let url = "/offers?" + paramsStr;
                console.log("Fetching offers from: ", url);
                try {
                    const response = await axios.get(url);
                    console.log("New offers received: ", Object.keys(response['data']['results']).length)
                    commit('setRawOffers', {offers: response['data']['results']})
                } finally {
                    commit('setOffersLoading', false)
                }
            }
        },
        async fetchCountries({commit, state}) {
            const countries = await fetchLocationSearchData("/countries", {
                api_key: state.userProfile.apiKey,
            })
            if (countries) {
                commit('setLocationSearchCountries', countries)
            }
        },
        async fetchRegions({commit, state}, params) {
            const regions = await fetchLocationSearchData("/regions", {
                api_key: state.userProfile.apiKey,
                ...params,
            })
            if (regions) {
                commit('setLocationSearchRegions', regions)
            }
        },
        async fetchCities({commit, state}, params) {
            const cities = await fetchLocationSearchData("/cities", {
                api_key: state.userProfile.apiKey,
                ...params
            })
            if (cities) {
                commit('setLocationSearchCities', cities)
            }
        },
        async fetchNeighborhoods({commit, state}, params) {
            const neighborhoods = await fetchLocationSearchData("/neighborhoods", {
                api_key: state.userProfile.apiKey,
                ...params
            })
            if (neighborhoods) {
                commit('setLocationSearchNeighborhoods', neighborhoods)
            }
        },
    },
    getters: {
        userLocations: state => state.userProfile?.userLocations,
        offersLoading: state => state.offersLoading,
        selectedOffer: state => state.selectedOffer,
        isAuthenticated: state => state.userProfile != null & fb.auth.currentUser != null,
        isAnonymousUser: state => state.userProfile != null & fb.auth.currentUser.isAnonymous,
        offers: function (state) {
            if (!state.userProfile?.offersHistory || !state.rawOffers?.offers) {
                return []
            }
            return parseRawOffers(Object.values(state.rawOffers.offers), state.userProfile.offersHistory);
        },
    },
})

async function fetchLocationSearchData(path, params) {
    Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
    const paramsStr = new URLSearchParams(params).toString();
    const response = await axios.get(path + "?" + paramsStr);
    return Object.values(response.data.results).map(function (item) {
        return {
            value: item['general']['id'],
            text: item['general']['name'],
        };
    });
}

function parseRawOffers(offersList, offersHistory) {
    return offersList.map(function (item) {
        let offerId = item["general"]["id"];
        let subtype = item["general"]["subtype"] || item["general"]["type"]
        if (subtype === "commercial") {
            subtype = "comm";
        } else if (subtype === "parkingSpot") {
            subtype = "parking";
        }

        let rawPrices = item["price"];
        let currentPriceStr = rawPrices ? `${rawPrices["current"]} ${rawPrices["currency"]}` : "";
        let discountPrice = rawPrices ? (rawPrices["max"] - rawPrices["current"]) : null;
        let discountPriceStr = discountPrice ? `(-${Math.round(discountPrice / rawPrices["max"] * 1000) / 10}%)` : "";
        let prices = rawPrices ? [
            {type: "Min", price: `${rawPrices["min"]} ${rawPrices["currency"]}`},
            {type: "Max", price: `${rawPrices["max"]} ${rawPrices["currency"]}`},
            {type: "Current", price: `${currentPriceStr} ${discountPriceStr}`},
            {type: "PSQ", price: `${rawPrices["perSquareMeter"]} ${rawPrices["currency"]}`},
        ] : null;

        let rawEvents = item["events"]
        let publishedDateStr = rawEvents ? rawEvents["visibility"]["0"]["date"] : null;
        let lastUpdatedDateStr = rawEvents ? rawEvents["visibility"].slice(-1)[0]["date"] : null;
        let updates = rawEvents && rawEvents["dataUpdates"] ? rawEvents["dataUpdates"].map(function (update) {
            return {
                date: update.date,
                type: update.type,
                value: `${update.value.old} -> ${update.value.new}`
            };
        }) : null;

        let rawSpace = item["space"]
        let roomFullStr = rawSpace?.room?.full || "";
        let roomsStr = rawSpace?.room ? `${rawSpace?.room?.min || ""}/${rawSpace?.room?.max || ""}/${roomFullStr}` : null;
        let sizeStr = rawSpace?.usable ? `${rawSpace["usable"]["min"]}m2` : null;
        let landStr = rawSpace?.land ? `${rawSpace["land"]["min"]}m2` : null;

        let rawCoordinates = item["geography"] ? item["geography"]["coordinates"][0] : null;
        let coordinates = rawCoordinates ? {
            lat: parseFloat(rawCoordinates.split(",")[0]),
            lng: parseFloat(rawCoordinates.split(",")[1]),
        } : null;
        let marker = coordinates ? {
            id: offerId,
            position: coordinates
        } : null;

        let offerHistory = offersHistory.find((e) => e.offerId === offerId);
        let category = offerHistory?.category || 0;

        let urls = item["general"]["url"].map(url => ({url: url}));

        return {
            id: offerId,
            current_price: currentPriceStr,
            published: publishedDateStr,
            updated: lastUpdatedDateStr,
            updates: updates,
            type: subtype,
            rooms: roomsStr,
            size: sizeStr,
            land: landStr,
            category: category,
            favorite: category === 1,
            archived: category === 10,
            prices: prices,
            marker: marker,
            urls: urls,
        }
    })
}
