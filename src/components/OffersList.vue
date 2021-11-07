<template>
  <b-container>
    <b-modal id="modalEmbed" size="xl" ok-only hide-header>
      <b-embed
          type="iframe"
          aspect="16by9"
          :src="selectedOfferUrl"
          allowfullscreen/>

      <template #modal-footer="">
        <b-button v-if="selectedOffer != null"
                  :variant="selectedOffer.archived ? 'dark' : 'outline-dark'"
                  size="sm"
                  @click="toggleArchive(selectedOffer)">
          <b-icon icon="archive"></b-icon>
        </b-button>

        <b-button v-if="selectedOffer != null"
                  :variant="selectedOffer.favorite ? 'primary' : 'outline-primary'"
                  size="sm"
                  @click="toggleFavorite(selectedOffer)">
          <b-icon icon="heart"></b-icon>
        </b-button>

        <b-button v-if="selectedOffer != null"
                  variant="primary"
                  size="sm"
                  @click="closeModal()">
          OK
        </b-button>
      </template>
    </b-modal>

    <h5 class="mt-4" v-if="(favorites || []).length > 0">Favorites</h5>
    <OffersTable :fields="fields"
                 :offers="favorites"
                 v-if="(favorites || []).length > 0"/>

    <h5 class="mt-4" v-if="(untagged || []).length > 0">New</h5>
    <OffersTable :fields="fields"
                 :offers="untagged"
                 v-if="(untagged || []).length > 0"/>

    <h5 class="mt-4" v-if="(archived || []).length > 0">Archived</h5>
    <OffersTable :fields="fields"
                 :offers="archived"
                 v-if="(archived || []).length > 0"/>
  </b-container>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import OffersTable from "@/components/OffersTable";
import _ from 'lodash'

export default {
  name: 'Offers',
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
        {key: 'controls', sortable: false, label: ""},
      ],
      selectedOfferUrl: "",
    }
  },
  computed: {
    ...mapState(['userProfile']),
    ...mapGetters(['offers', 'offersLoading', 'selectedOffer']),

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
  async mounted() {
    await this.$store.dispatch('fetchOffers', this.$route.query)
  },
  watch: {
    async $route(to, from) {
      await this.$store.dispatch('fetchOffers', to.query)
    },
    userProfile: async function (newValue, oldValue) {
      if (newValue != null && !this.offers) {
        await this.$store.dispatch('fetchOffers', this.$route.query)
      }
    },
    selectedOffer: async function (newValue, oldValue) {
      // if (newValue != null) {
        // if (!this.$isMobile()) {
        //   for (let url of newValue.urls) {
        //     let domain = (new URL(url.url));
        //     if (domain.hostname.replace("www.", "") === "sreality.cz") {
        //       this.selectedOfferUrl = url.url;
        //       this.$bvModal.show('modalEmbed');
        //       return;
        //     }
        //   }
        // }
        window.open(newValue.urls[0].url, '_blank');
      // } else {
      //   this.$bvModal.hide('modalEmbed');
      // }
    },
  },
  methods: {
    hasSelectedOfferMoreUrls(offer) {

    },
    getSelectedOfferSortedUrls(offer) {

    },
    navigateToSelectedOfferNextUrl(offer) {

    },
    async toggleFavorite(offer) {
      const newValue = (offer.category === 1) ? 0 : 1;
      await this.$store.dispatch('updateOfferCategory', {offer: offer, category: newValue})
      await this.closeModal()
    },
    async toggleArchive(offer) {
      const newValue = (offer.category === 10) ? 0 : 10;
      await this.$store.dispatch('updateOfferCategory', {offer: offer, category: newValue})
      await this.closeModal()
    },
    async closeModal() {
      await this.$store.dispatch('setSelectedOffer', null)
    },
  }
}
</script>
