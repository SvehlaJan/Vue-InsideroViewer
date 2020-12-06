<template>
  <b-container fluid="xl">
    <b-overlay :show="isLoading" rounded="sm">
      <h3 v-if="(favorites || []).length > 0">Favorites</h3>
      <OffersTable :fields="fields"
                   :offers="favorites"
                   v-if="(favorites || []).length > 0"
                   @toggleArchive="toggleArchive"
                   @toggleFavorite="toggleFavorite"/>

      <h3 v-if="(untagged || []).length > 0">New</h3>
      <OffersTable :fields="fields"
                   :offers="untagged"
                   v-if="(untagged || []).length > 0"
                   @toggleArchive="toggleArchive"
                   @toggleFavorite="toggleFavorite"/>

      <h3 v-if="(archived || []).length > 0">Archived</h3>
      <OffersTable :fields="fields"
                   :offers="archived"
                   v-if="(archived || []).length > 0"
                   @toggleArchive="toggleArchive"
                   @toggleFavorite="toggleFavorite"/>
    </b-overlay>
  </b-container>
</template>

<script>
import {mapState} from "vuex";
import OffersTable from "@/components/OffersTable";
import _ from 'underscore'

export default {
  name: 'Offers',
  props: ['items', 'isLoading'],
  components: {OffersTable},
  data() {
    return {
      fields: [
        {key: 'id', sortable: false},
        {key: 'current_price', sortable: true, label: "Price"},
        {key: 'published', sortable: true},
        {key: 'updated', sortable: true},
        {key: 'subtype', sortable: false},
        {key: 'rooms', sortable: false},
        {key: 'size', sortable: true},
        {key: 'land', sortable: true},
        {key: 'favorite', sortable: false, label: ""},
        {key: 'archived', sortable: false, label: ""},
        {key: 'show_details', sortable: false, label: ""},
      ],
    }
  },
  computed: {
    ...mapState(['userProfile']),

    offers: function () {
      if (!this.userProfile.offersHistory || this.items.length === 0) {
        return []
      }

      const offersHistory = this.userProfile.offersHistory;
      return this.items.map(function (item) {
        let offerId = item["general"]["id"];
        let subtype = item["general"]["subtype"]
        let rawPrices = item["price"];
        let currentPriceStr = rawPrices ? `${rawPrices["current"]} ${rawPrices["currency"]}` : "";
        let discountPrice = rawPrices ? (rawPrices["max"] - rawPrices["current"]) : null;
        let discountPriceStr = discountPrice ? `(-${Math.round(discountPrice / rawPrices["max"] * 1000) / 10}%)` : "";
        let prices = rawPrices ? [
          {type: "Min", price: `${rawPrices["min"]} ${rawPrices["currency"]}`},
          {type: "Max", price: `${rawPrices["max"]} ${rawPrices["currency"]}`},
          {type: "Current", price: currentPriceStr},
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
          current_price: `${currentPriceStr}\n${discountPriceStr}`,
          published: publishedDateStr,
          updated: lastUpdatedDateStr,
          updates: updates,
          subtype: subtype,
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
    favorites: function () {
      return _.where(this.offers, {favorite: true});
    },
    archived: function () {
      return _.where(this.offers, {archived: true});
    },
    untagged: function () {
      return _.where(this.offers, {favorite: false, archived: false});
    }
  },
  methods: {
    updateCategory(category, offer_id) {
      const payload = {
        offer_id: offer_id,
        category: category
      }

      let result = new Promise((resolve) => this.$emit('updateCategory', payload, resolve));
      result.then((value) => console.log(value))
      return result
    },
    toggleFavorite(offer) {
      const newValue = (offer.category === 1) ? 0 : 1;
      this.updateCategory(newValue, offer.id)
    },
    toggleArchive(offer) {
      const newValue = (offer.category === 10) ? 0 : 10;
      this.updateCategory(newValue, offer.id)
    }
  }
}
</script>

<style>
.hidden_header {
  display: none;
}
</style>