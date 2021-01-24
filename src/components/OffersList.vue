<template>
  <b-container>
    <b-modal id="modalEmbed" size="xl" ok-only hide-header>
      <b-embed
          type="iframe"
          aspect="16by9"
          :src="selectedOfferUrl"
          allowfullscreen/>

      <template #modal-footer="{ ok }">
        <b-button size="sm"
                  :variant="selectedOffer.archived.value ? 'dark' : 'outline-dark'"
                  @click="toggleArchive(selectedOffer)">
          <b-icon icon="archive"></b-icon>
        </b-button>

        <b-button size="sm"
                  :variant="selectedOffer.favorite.value ? 'primary' : 'outline-primary'"
                  @click="toggleFavorite(selectedOffer)">
          <b-icon icon="heart"></b-icon>
        </b-button>

        <b-button variant="primary" @click="ok()">
          OK
        </b-button>
      </template>
    </b-modal>

    <b-overlay :show="isLoading" rounded="sm">
      <h3 class="mt-4" v-if="(favorites || []).length > 0">Favorites</h3>
      <OffersTable :fields="fields"
                   :offers="favorites"
                   v-if="(favorites || []).length > 0"
                   @showDetail="showDetail"
                   @toggleArchive="toggleArchive"
                   @toggleFavorite="toggleFavorite"/>

      <h3 class="mt-4" v-if="(untagged || []).length > 0">New</h3>
      <OffersTable :fields="fields"
                   :offers="untagged"
                   v-if="(untagged || []).length > 0"
                   @showDetail="showDetail"
                   @toggleArchive="toggleArchive"
                   @toggleFavorite="toggleFavorite"/>

      <h3 class="mt-4" v-if="(archived || []).length > 0">Archived</h3>
      <OffersTable :fields="fields"
                   :offers="archived"
                   v-if="(archived || []).length > 0"
                   @showDetail="showDetail"
                   @toggleArchive="toggleArchive"
                   @toggleFavorite="toggleFavorite"/>
    </b-overlay>
  </b-container>
</template>

<script>
import {mapState} from "vuex";
import OffersTable from "@/components/OffersTable";
import _ from 'lodash'

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
        {key: 'type', sortable: false},
        {key: 'rooms', sortable: false},
        {key: 'size', sortable: true},
        {key: 'land', sortable: true},
        {key: 'favorite', sortable: false, label: ""},
        {key: 'archived', sortable: false, label: ""},
        {key: 'show_details', sortable: false, label: ""},
      ],
      selectedOffer: {},
      selectedOfferUrl: "",
    }
  },
  computed: {
    ...mapState(['userProfile']),

    offers: function () {
      if (this.userProfile?.offersHistory == null || this.items.length === 0) {
        return []
      }

      const offersHistory = this.userProfile.offersHistory;
      return this.items.map(function (item) {
        let offerId = item["general"]["id"];
        let subtype = item["general"]["subtype"] || item["general"]["type"]
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
    favorites: function () {
      return _.filter(this.offers, function (o) {
        return o.favorite
      });
    },
    archived: function () {
      return _.filter(this.offers, function (o) {
        return o.archived
      });
    },
    untagged: function () {
      return _.filter(this.offers, function (o) {
        return (!o.favorite && !o.archived)
      });
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
    showDetail(offer) {
      for (let url of offer.urls) {
        let domain = (new URL(url.url));
        if (domain.hostname.replace("www.", "") === "sreality.cz") {
          this.selectedOffer = offer;
          this.selectedOfferUrl = url.url;
          this.$bvModal.show('modalEmbed');
          return;
        }
      }
      window.open(offer.urls[0].url, '_blank');
    },
    toggleFavorite(offer) {
      const newValue = (offer.category === 1) ? 0 : 1;
      this.updateCategory(newValue, offer.id);
      this.$bvModal.hide('modalEmbed');
    },
    toggleArchive(offer) {
      const newValue = (offer.category === 10) ? 0 : 10;
      this.updateCategory(newValue, offer.id);
      this.$bvModal.hide('modalEmbed');
    }
  }
}
</script>

<style>
.hidden_header {
  display: none;
}
</style>
