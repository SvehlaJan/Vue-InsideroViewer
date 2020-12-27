<template>
  <b-container fluid="xl">
    <OffersList :items="offers" @updateCategory="updateCategory" :isLoading="isLoading"/>
  </b-container>
</template>

<script>
import OffersList from '../components/OffersList.vue'
import {mapState} from "vuex";

export default {
  name: 'Dashboard',
  data() {
    return {
      offersInfo: {},
      offers: [],
      isLoading: false
    }
  },
  mounted() {
    if (this.userProfile != null) {
      this.getOffers(this.$route.query)
    }
  },
  components: {
    OffersList,
  },
  computed: {
    ...mapState(['userProfile']),
  },
  watch: {
    $route(to, from) {
      // console.log("Route change: ", to.query)
      this.getOffers(to.query);
    },
    userProfile: function (newValue, oldValue) {
      if (newValue != null &&
          this.offersInfo == null &&
          this.isLoading === false) {
        this.getOffers(this.$route.query)
      }
    },
  },
  methods: {
    async getOffers(query) {
      if (query != null && this.userProfile?.apiKey) {
        this.isLoading = true;

        // console.log("Getting offers...", this.userProfile.apiKey)
        const params = {
          api_key: this.userProfile.apiKey,
          country: query.country,
          region: query.region,
          city: query.city,
          type: query.type,
          offer: "sell",
          active: "true",
        }
        Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
        const paramsStr = new URLSearchParams(params).toString();
        this.$axios
            .get("/offers?" + paramsStr)
            .then(response => {
              // console.log("New offers received: ", Object.keys(response['data']['results']).length)
              this.offersInfo = response['data']['info']
              this.offers = Object.values(response['data']['results'])
            })
            .catch(err => {
              console.log(err.response);
            }).finally(() => this.isLoading = false);
      }
    },
    updateCategory(payload) {
      if (!this.userProfile.offersHistory) {
        this.userProfile.offersHistory = []
      }

      const index = this.userProfile.offersHistory.findIndex((e) => e.offerId === payload.offer_id);
      const newEntry = {offerId: payload.offer_id, category: payload.category};
      if (index === -1) {
        this.userProfile.offersHistory.push(newEntry);
      } else {
        this.userProfile.offersHistory[index] = newEntry;
      }

      this.$store.dispatch('updateProfile', {
        apiKey: this.userProfile.apiKey,
        userLocations: this.userProfile.userLocations,
        offersHistory: this.userProfile.offersHistory,
      })
    },
  },
}
</script>