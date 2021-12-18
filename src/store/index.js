import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import { router } from "@/router";
import axios from "axios";
import _ from "lodash";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    apiKey: "",
    offersHistory: new Map(),
    savedLocations: new Map(),
    browsingHistory: new Map(),
    rawOffers: {},
    parsedOffers: { favorites: [], new: [], seen: [], trash: [] },
    offersLoading: false,
    selectedOffer: {},
    spaceMin: 75,
    propertyType: "",

    locationSearchCountries: [],
    locationSearchRegions: [],
    locationSearchCities: [],
    locationSearchNeighborhoods: []
  },
  mutations: {
    setApiKey(state, val) {
      state.apiKey = val;
    },
    setOffersHistory(state, val) {
      Vue.set(state, "offersHistory", val);
    },
    setSavedLocations(state, val) {
      Vue.set(state, "savedLocations", val);
    },
    setBrowsingHistory(state, val) {
      Vue.set(state, "browsingHistory", val);
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
    setPropertyType(state, val) {
      state.propertyType = val;
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
      dispatch("fetchUserProfile");
    },
    async signInWithEmailAndPassword({ dispatch }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );
      dispatch("fetchUserProfile");
    },
    async signUpWithEmailAndPassword({ dispatch }, form) {
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      dispatch("fetchUserProfile");
    },
    async createAccountForAnonymousUser({ dispatch }, form) {
      const credential = fb.authNamespace.EmailAuthProvider.credential(
        form.email,
        form.password
      );
      const { user } = await fb.auth.currentUser.linkWithCredential(credential);
      dispatch("fetchUserProfile");
    },
    async changeUserPassword({ dispatch, state }, form) {
      const credential = fb.authNamespace.EmailAuthProvider.credential(
        fb.auth.currentUser.email,
        form.currentPassword
      );
      await fb.auth.currentUser.reauthenticateWithCredential(credential);

      // await fb.auth.currentUser.updatePassword(form.newPassword)
    },
    async fetchUserProfile({ commit, dispatch }) {
      const userProfile = await fb.currentUsersDoc().get();
      commit("setApiKey", userProfile.data().apiKey);
      commit("setSpaceMin", userProfile.data().spaceMin);
      commit("setPropertyType", userProfile.data().propertyType);

      await dispatch("fetchOffersHistory");
      await dispatch("fetchSavedLocations");

      if (router.currentRoute.path === "/login") {
        await router.push("/");
      }
    },
    async logout({ commit }) {
      await fb.auth.signOut();
      commit("setApiKey", "");
      commit("setSpaceMin", 0);
      commit("setSpaceMin", "");
      await router.push("/login");
    },
    async setSelectedOffer({ commit }, offer) {
      commit("setSelectedOffer", offer);
    },
    async setApiKey({ commit }, apiKey) {
      commit("setApiKey", apiKey);
      await fb.currentUsersDoc().set({ apiKey }, { merge: true });
    },
    async setSpaceMin({ commit }, spaceMin) {
      commit("setSpaceMin", spaceMin);
      await fb.currentUsersDoc().set({ spaceMin }, { merge: true });
    },
    async setPropertyType({ commit }, propertyType) {
      commit("setPropertyType", propertyType);
      await fb.currentUsersDoc().set({ propertyType }, { merge: true });
    },
    async insertOrUpdateOfferState({ dispatch, commit, state }, offer) {
      commit("setOffersLoading", true);
      await fb.usersOfferHistory().doc(`${offer.id}`).set(offer, { merge: true });
      await dispatch("fetchOffersHistory");

      const lastOpenedTimestamp = await getLastOpenedTimestamp(this.$route.query);

      const refreshedOffers = parseRawOffers(
        state.rawOffers,
        state.offersHistory,
        lastOpenedTimestamp,
      );
      commit("setParsedOffers", refreshedOffers);
      commit("setOffersLoading", false);
    },
    async fetchOffersHistory({ commit }) {
      const offersHistory = await fb.getUsersOfferHistory();
      commit("setOffersHistory", offersHistory);
    },
    async insertOrUpdateSavedLocation({ dispatch }, location) {
      const locationId = `${location.country?.value}-${location.region?.value}-${location.city?.value}-${location.neighborhood?.value}`;
      await fb
        .usersSavedLocations()
        .doc(locationId)
        .set(location, { merge: true });
      await dispatch("fetchSavedLocations");
    },
    async fetchSavedLocations({ commit }) {
      const savedLocations = await fb.getUsersSavedLocations();
      commit("setSavedLocations", savedLocations);
    },
    async deleteSavedLocation({ dispatch }, location) {
      const locationId = `${location.country?.value}-${location.region?.value}-${location.city?.value}-${location.neighborhood?.value}`;
      await fb.deleteUsersSavedLocation(locationId);
      await dispatch("fetchSavedLocations");
    },
    async fetchOffers({ commit, state }, query) {
      if (query != null && state.apiKey) {
        commit("setOffersLoading", true);
        const params = {
          api_key: state.apiKey,
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
        const lastOpenedTimestamp = await getLastOpenedTimestamp(query);

        try {
          let timestamp = Date.now();
          const response = await axios.get(url);
          const rawOffers = response["data"]["results"];

          console.log("New offers received: ", Object.keys(rawOffers).length, " It took ", Date.now() - timestamp, "ms");
          timestamp = Date.now();

          const parsedOffers = parseRawOffers(
            Object.values(rawOffers),
            state.offersHistory,
            lastOpenedTimestamp,
          );
          commit("setRawOffers", Object.values(rawOffers));
          commit("setParsedOffers", parsedOffers);

          console.log("Parsing & Saving - Done, It took ", Date.now() - timestamp, "ms");
          timestamp = Date.now();

          const queryStr = new URLSearchParams(query).toString();
          fb.usersBrowsingHistory().doc(queryStr).set({"lastOpened": Date.now()}, { merge: true });;
          console.log("Saving browsing history - Done, It took ", Date.now() - timestamp, "ms");
        } finally {
          commit("setOffersLoading", false);
        }
      }
    },
    async fetchCountries({ commit, state }) {
      const countries = await fetchLocationSearchData("/countries", {
        api_key: state.apiKey
      });
      if (countries) {
        commit("setLocationSearchCountries", countries);
      }
    },
    async fetchRegions({ commit, state }, params) {
      const regions = await fetchLocationSearchData("/regions", {
        api_key: state.apiKey,
        ...params
      });
      if (regions) {
        commit("setLocationSearchRegions", regions);
      }
    },
    async fetchCities({ commit, state }, params) {
      const cities = await fetchLocationSearchData("/cities", {
        api_key: state.apiKey,
        ...params
      });
      if (cities) {
        commit("setLocationSearchCities", cities);
      }
    },
    async fetchNeighborhoods({ commit, state }, params) {
      const neighborhoods = await fetchLocationSearchData("/neighborhoods", {
        api_key: state.apiKey,
        ...params
      });
      if (neighborhoods) {
        commit("setLocationSearchNeighborhoods", neighborhoods);
      }
    }
  },
  getters: {
    userApiKey: (state) => state.apiKey,
    offersLoading: (state) => state.offersLoading,
    selectedOffer: (state) => state.selectedOffer,
    spaceMin: (state) => state.spaceMin,
    propertyType: (state) => state.propertyType,
    hasSavedLocations: (state) => state.savedLocations.size > 0,
    savedLocations: (state) => state.savedLocations || new Map(),
    savedLocationsArray: (state) => {
      // return locations ordered by order property
      const locations = Array.from(state.savedLocations.values());
      locations.sort((a, b) => a.order - b.order);
      return locations;
    },
    parsedOffers: (state) => state.parsedOffers,
    isAuthenticated: (state) =>
      state.apiKey != "" && fb.auth.currentUser != null,
    isAnonymousUser: (state) =>
      state.apiKey != "" && fb.auth.currentUser?.isAnonymous
  }
});

async function getLastOpenedTimestamp(query) {
  const queryStr = new URLSearchParams(query).toString();
  const browsingHistory = await fb.usersBrowsingHistory()?.doc(queryStr).get();
  const timestamp = browsingHistory?.data()?.lastOpened ?? 0;
  return timestamp;
}

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

function parseRawOffers(offersList, offersHistory, lastOpenedTimestamp) {
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
    let publishedDate = rawEvents
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
    let lastUpdatedDate = updates.length > 0 ? updates.slice(-1)[0]["date"] : publishedDate;

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

    let urls = item["urls"]["activeUrls"].map((url) => ({ url: url })) ?? [];
    let allUrls = item["urls"]["allUrls"].map((url) => ({ url: url })) ?? [];
    const offerHistory = offersHistory.get(`${offerId}`);

    const offer = {
      id: offerId,
      current_price: currentPriceStr,
      published: publishedDate,
      updated: lastUpdatedDate,
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
      urls: urls,
      allUrls: allUrls,
    };

    if (offer.favorite) {
      parsedOffers.favorites.push(offer);
      return;
    }
    if (offer.trash) {
      parsedOffers.trash.push(offer);
      return;
    }
    if (lastOpenedTimestamp - new Date(lastUpdatedDate).getTime() < 0) {
      parsedOffers.new.push(offer);
      return;
    }
    parsedOffers.seen.push(offer);
  });
  return parsedOffers;
}
