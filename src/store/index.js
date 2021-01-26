import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import {router} from '@/router'
import axios from 'axios'


Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userProfile: {},
        rawOffers: {offers: {}},
        selectedOffer: {},
        offersLoading: false,
    },
    mutations: {
        setUserProfile(state, val) {
            // console.log("setting user profile:", val)
            state.userProfile = val
        },
        setRawOffers(state, val) {
            // console.log("setting raw offers:", val)
            state.rawOffers = val
            Vue.set(state, 'rawOffers', val)
        },
        setSelectedOffer(state, val) {
            // console.log("setting selected offer:", val)
            state.selectedOffer = val
        },
        setOffersLoading(state, val) {
            // console.log("setting offers loading:", val)
            state.offersLoading = val
        },
    },
    actions: {
        async login({dispatch}, form) {
            const {user} = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
            dispatch('fetchUserProfile', user)
        },
        async signup({dispatch}, form) {
            const {user} = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
            await fb.usersCollection.doc(user.uid).set({
                apiKey: '',
            })
            dispatch('fetchUserProfile', user)
        },
        async fetchUserProfile({commit}, user) {
            const userProfile = await fb.usersCollection.doc(user.uid).get()
            commit('setUserProfile', userProfile.data())
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
            const userRef = await fb.usersCollection.doc(userId).update({
                apiKey: user.apiKey,
                userLocations: user.userLocations,
                offersHistory: user.offersHistory,
            })

            dispatch('fetchUserProfile', {uid: userId})
        },
        async setSelectedOffer({commit}, offer) {
            commit('setSelectedOffer', offer);
        },
        async fetchOffers(context, query) {
            if (query != null && context.state.userProfile?.apiKey) {
                context.commit('setOffersLoading', true)

                const params = {
                    api_key: context.state.userProfile.apiKey,
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
                let url = "/offers?" + paramsStr
                console.log("Fetching offers from: ", url)
                await axios.get(url)
                    .then(response => {
                        console.log("New offers received: ", Object.keys(response['data']['results']).length)
                        context.commit('setRawOffers', {offers: response['data']['results']})
                    })
                    .catch(err => {
                        console.log(err.response);
                    }).finally(() => context.commit('setOffersLoading', false));
            }
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

            await dispatch('updateProfile', {
                apiKey: state.userProfile.apiKey,
                userLocations: state.userProfile.userLocations,
                offersHistory: offersHistory,
            })
        }
    },
    getters: {
        userLocations: state => state.userProfile?.userLocations,
        offersLoading: state => state.offersLoading,
        selectedOffer: state => state.selectedOffer,
        offers: function (state) {
            if (!state.userProfile?.offersHistory || !state.rawOffers?.offers) {
                return []
            }

            const offersHistory = state.userProfile.offersHistory;
            const offersList = Object.values(state.rawOffers?.offers)
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
        },
    },
})
