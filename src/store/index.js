import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import { router } from "@/router";
import axios from "axios";
import _ from "lodash";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    userProfile: {},
    offersHistory: new Map(),
    savedLocations: new Map(),
    rawOffers: {},
    parsedOffers: { favorites: [], new: [], seen: [], trash: [] },
    offersLoading: false,
    selectedOffer: {},
    spaceMin: 75,
    lastQuery: "",

    locationSearchCountries: [],
    locationSearchRegions: [],
    locationSearchCities: [],
    locationSearchNeighborhoods: []
  },
  mutations: {
    setUserProfile(state, val) {
      Vue.set(state, "userProfile", val);
    },
    setOffersHistory(state, val) {
      Vue.set(state, "offersHistory", val);
    },
    setSavedLocations(state, val) {
      Vue.set(state, "savedLocations", val);
    },
    setRawOffers(state, val) {
      Vue.set(state, "rawOffers", val);
    },
    setParsedOffers(state, val) {
      Vue.set(state, "parsedOffers", val);
    },
    setSelectedOffer(state, val) {
      state.selectedOffer = val;
    },
    setSpaceMin(state, val) {
      state.spaceMin = val;
    },
    setLastQuery(state, val) {
      state.lastQuery = val;
    },
    setOffersLoading(state, val) {
      state.offersLoading = val;
    },
    setLocationSearchCountries(state, val) {
      Vue.set(state, "locationSearchCountries", val);
    },
    setLocationSearchRegions(state, val) {
      Vue.set(state, "locationSearchRegions", val);
    },
    setLocationSearchCities(state, val) {
      Vue.set(state, "locationSearchCities", val);
    },
    setLocationSearchNeighborhoods(state, val) {
      Vue.set(state, "locationSearchNeighborhoods", val);
    }
  },
  actions: {
    async signInAnonymously({ dispatch }) {
      const { user } = await fb.auth.signInAnonymously();
      await fb.usersCollection.doc(user.uid).set({
        apiKey: "",
      });
      dispatch("fetchUserProfile", user);
    },
    async signInWithEmailAndPassword({ dispatch }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );
      dispatch("fetchUserProfile", user);
    },
    async signUpWithEmailAndPassword({ dispatch }, form) {
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      await fb.usersCollection.doc(user.uid).set({
        apiKey: "",
      });
      dispatch("fetchUserProfile", user);
    },
    async createAccountForAnonymousUser({ dispatch }, form) {
      const credential = fb.authNamespace.EmailAuthProvider.credential(
        form.email,
        form.password
      );
      const { user } = await fb.auth.currentUser.linkWithCredential(credential);
      dispatch("fetchUserProfile", user);
    },
    async changeUserPassword({ dispatch, state }, form) {
      const credential = fb.authNamespace.EmailAuthProvider.credential(
        fb.auth.currentUser.email,
        form.currentPassword
      );
      await fb.auth.currentUser.reauthenticateWithCredential(credential);

      // await fb.auth.currentUser.updatePassword(form.newPassword)
    },
    async fetchUserProfile({ commit, dispatch }, user) {
      const userProfile = await fb.usersCollection.doc(user.uid).get();
      const userAuth = fb.auth.currentUser;

      await commit("setUserProfile", {
        ...userProfile.data(),
        isAnonymous: userAuth.isAnonymous
      });

      await dispatch("fetchOffersHistory", user.uid);
      await dispatch("fetchSavedLocations", user.uid);

      if (router.currentRoute.path === "/login") {
        await router.push("/");
      }
    },
    async logout({ commit }) {
      await fb.auth.signOut();
      commit("setUserProfile", {});
      await router.push("/login");
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid;
      const userRef = await fb.usersCollection.doc(userId).update(user);

      dispatch("fetchUserProfile", { uid: userId });
    },
    async setSelectedOffer({ commit }, offer) {
      commit("setSelectedOffer", offer);
    },
    async setSpaceMin({ commit }, spaceMin) {
      commit("setSpaceMin", spaceMin);
    },
    async insertOrUpdateOfferState({ dispatch, commit, state }, offer) {
      commit("setOffersLoading", true);
      const userId = fb.auth.currentUser.uid;
      await fb
        .usersOfferHistory(userId)
        .doc(`${offer.id}`)
        .set(offer, { merge: true });
      await dispatch("fetchOffersHistory", userId);
      const refreshedOffers = parseRawOffers(
        state.rawOffers,
        state.offersHistory
      );
      commit("setParsedOffers", refreshedOffers);
      commit("setOffersLoading", false);
    },
    async fetchOffersHistory({ commit }, userId) {
      const offersHistory = await fb.getUsersOfferHistory(userId);
      commit("setOffersHistory", offersHistory);
    },
    async insertOrUpdateSavedLocation({ dispatch }, location) {
      const userId = fb.auth.currentUser.uid;
      const locationId = `${location.country?.value}-${location.region?.value}-${location.city?.value}-${location.neighborhood?.value}`;
      await fb
        .usersSavedLocations(userId)
        .doc(locationId)
        .set(location, { merge: true });
      await dispatch("fetchSavedLocations", userId);
    },
    async fetchSavedLocations({ commit }, userId) {
      const savedLocations = await fb.getUsersSavedLocations(userId);
      commit("setSavedLocations", savedLocations);
    },
    async deleteSavedLocation({ dispatch }, location) {
      const userId = fb.auth.currentUser.uid;
      const locationId = `${location.country?.value}-${location.region?.value}-${location.city?.value}-${location.neighborhood?.value}`;
      await fb.deleteUsersSavedLocation(userId, locationId);
      await dispatch("fetchSavedLocations", userId);
    },
    async fetchOffers({ commit, state }, query) {
      if (query != null && state.userProfile?.apiKey && query !== state.lastQuery) {
        commit("setOffersLoading", true);
        const params = {
          api_key: state.userProfile.apiKey,
          country: query.country,
          region: query.region,
          city: query.city,
          neighborhood: query.neighborhood,
          type: query.type === "all" ? null : query.type,
          active: query.active === "all" ? null : query.active,
          spaceMin: state.spaceMin,
          limit: 250,
          sortBy: "id",
          offer: "sell"
        };
        Object.keys(params).forEach(
          (key) => params[key] == null && delete params[key]
        );
        const paramsStr = new URLSearchParams(params).toString();
        let url = "/offers?" + paramsStr;
        try {
          // const response = await axios.get(url);
          // const rawOffers = response["data"]["results"];
          // console.log("New offers received: ", Object.keys(rawOffers).length);

          // const parsedOffers = parseRawOffers(
          //   Object.values(rawOffers),
          //   state.offersHistory
          // );
          // commit("setRawOffers", Object.values(rawOffers));
          // commit("setParsedOffers", parsedOffers);
          // console.log("Parsing & Saving - Done");
          commit("setLastQuery", query);
        } finally {
          commit("setOffersLoading", false);
        }
      } else {
        console.log("No new offers");
      }
    },
    async fetchCountries({ commit, state }) {
      const countries = await fetchLocationSearchData("/countries", {
        api_key: state.userProfile.apiKey
      });
      if (countries) {
        commit("setLocationSearchCountries", countries);
      }
    },
    async fetchRegions({ commit, state }, params) {
      const regions = await fetchLocationSearchData("/regions", {
        api_key: state.userProfile.apiKey,
        ...params
      });
      if (regions) {
        commit("setLocationSearchRegions", regions);
      }
    },
    async fetchCities({ commit, state }, params) {
      const cities = await fetchLocationSearchData("/cities", {
        api_key: state.userProfile.apiKey,
        ...params
      });
      if (cities) {
        commit("setLocationSearchCities", cities);
      }
    },
    async fetchNeighborhoods({ commit, state }, params) {
      const neighborhoods = await fetchLocationSearchData("/neighborhoods", {
        api_key: state.userProfile.apiKey,
        ...params
      });
      if (neighborhoods) {
        commit("setLocationSearchNeighborhoods", neighborhoods);
      }
    }
  },
  getters: {
    offersLoading: (state) => state.offersLoading,
    selectedOffer: (state) => state.selectedOffer,
    spaceMin: (state) => state.spaceMin,
    hasSavedLocations: (state) => state.savedLocations.size > 0,
    savedLocations: (state) => state.savedLocations || new Map(),
    parsedOffers: (state) => state.parsedOffers,
    isAuthenticated: (state) =>
      (state.userProfile != null) & (fb.auth.currentUser != null),
    isAnonymousUser: (state) =>
      (state.userProfile != null) & fb.auth.currentUser.isAnonymous
  }
});

async function fetchLocationSearchData(path, params) {
  Object.keys(params).forEach(
    (key) => params[key] == null && delete params[key]
  );
  const paramsStr = new URLSearchParams(params).toString();
  const response = await axios.get(path + "?" + paramsStr);
  return Object.values(response.data.results).map(function (item) {
    return {
      value: item["general"]["id"],
      text: item["general"]["name"]
    };
  });
}

function parseRawOffers(offersList, offersHistory) {
  const parsedOffers = { favorites: [], new: [], seen: [], trash: [] };
  offersList.forEach(function (item) {
    let offerId = item["general"]["id"];
    let subtype = item["general"]["subtype"] || item["general"]["type"];
    if (subtype === "commercial") {
      subtype = "comm";
    } else if (subtype === "parkingSpot") {
      subtype = "parking";
    }

    let rawPrices = item["price"];
    let currentPriceStr = rawPrices
      ? `${rawPrices["current"]} ${rawPrices["currency"]}`
      : "";
    let discountPrice = rawPrices
      ? rawPrices["max"] - rawPrices["current"]
      : null;
    let discountPriceStr = discountPrice
      ? `(-${Math.round((discountPrice / rawPrices["max"]) * 1000) / 10}%)`
      : "";
    let prices = rawPrices
      ? [
          {
            type: "Min",
            price: `${rawPrices["min"]} ${rawPrices["currency"]}`
          },
          {
            type: "Max",
            price: `${rawPrices["max"]} ${rawPrices["currency"]}`
          },
          {
            type: "Current",
            price: `${currentPriceStr} ${discountPriceStr}`
          },
          {
            type: "PSQ",
            price: `${rawPrices["perSquareMeter"]} ${rawPrices["currency"]}`
          }
        ]
      : null;

    let rawEvents = item["events"];
    let publishedDateStr = rawEvents
      ? rawEvents["visibility"]["0"]["date"]
      : null;
    let updates =
      rawEvents && rawEvents["dataUpdates"]
        ? rawEvents["dataUpdates"].map(function (update) {
            return {
              date: update.date,
              type: update.type,
              value: `${update.value.old} -> ${update.value.new}`
            };
          })
        : [];
    let lastUpdatedDateStr =
      updates.length > 0 ? updates.slice(-1)[0]["date"] : publishedDateStr;

    let rawSpace = item["space"];
    let roomFullStr = rawSpace?.room?.full || "";
    let roomsStr = rawSpace?.room
      ? `${rawSpace?.room?.min || ""}/${
          rawSpace?.room?.max || ""
        }/${roomFullStr}`
      : null;
    let spaceStr = rawSpace?.usable ? `${rawSpace["usable"]["min"]}m2` : null;
    let landStr = rawSpace?.land ? `${rawSpace["land"]["min"]}m2` : null;

    let rawCoordinates = item["geography"]
      ? item["geography"]["coordinates"][0]
      : null;
    let coordinates = rawCoordinates
      ? {
          lat: parseFloat(rawCoordinates.split(",")[0]),
          lng: parseFloat(rawCoordinates.split(",")[1])
        }
      : null;
    let marker = coordinates
      ? {
          id: offerId,
          position: coordinates
        }
      : null;
    let street = item["geography"]?.readable?.street;
    let neighborhood = item["geography"]?.readable?.neighborhood;
    let city = item["geography"]?.readable?.city;
    let address = `${neighborhood || street || city || ""}`;

    let urls = item["urls"]["activeUrls"].map((url) => ({ url: url }));
    const offerHistory = offersHistory.get(`${offerId}`);

    const offer = {
      id: offerId,
      current_price: currentPriceStr,
      published: publishedDateStr,
      updated: lastUpdatedDateStr,
      updates: updates,
      type: subtype,
      rooms: roomsStr,
      space: spaceStr,
      land: landStr,
      favorite: offerHistory?.favorite ?? false,
      archived: offerHistory?.archived ?? false,
      trash: offerHistory?.trash ?? false,
      prices: prices,
      marker: marker,
      address: address,
      urls: urls
    };

    if (offer.favorite) {
      parsedOffers.favorites.push(offer);
      return;
    }
    if (offer.trash) {
      parsedOffers.trash.push(offer);
      return;
    }
    if ((updates ?? []).length > 0) {
      var millisecondsPerDay = 1000 * 60 * 60 * 24 * 2;
      const nowDate = new Date();
      const lastUpdate = new Date(updates.slice(-1)[0]["date"]);
      const diff = nowDate.getTime() - lastUpdate.getTime();
      if (diff < millisecondsPerDay) {
        parsedOffers.new.push(offer);
        return;
      }
    }
    parsedOffers.seen.push(offer);
  });
  return parsedOffers;
}
