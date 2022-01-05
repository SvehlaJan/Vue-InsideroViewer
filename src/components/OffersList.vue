<template>
  <b-container>
    <b-modal id="modalEmbed" size="xl" ok-only hide-header>
      <b-embed
        type="iframe"
        aspect="16by9"
        :src="selectedOfferUrl"
        allowfullscreen
      />

      <template #modal-footer="">
        <b-button
          v-if="selectedOffer != null"
          :variant="selectedOffer.archived ? 'dark' : 'outline-dark'"
          size="sm"
          @click="toggleArchive(selectedOffer)"
        >
          <b-icon icon="archive"></b-icon>
        </b-button>

        <b-button
          v-if="selectedOffer != null"
          :variant="selectedOffer.favorite ? 'primary' : 'outline-primary'"
          size="sm"
          @click="toggleFavorite(selectedOffer)"
        >
          <b-icon icon="heart"></b-icon>
        </b-button>

        <b-button
          v-if="selectedOffer != null"
          variant="primary"
          size="sm"
          @click="closeModal()"
        >
          OK
        </b-button>
      </template>
    </b-modal>

    <h5 v-if="(parsedOffers.favorites || []).length > 0" class="mt-4">Favorites</h5>
    <OffersTable
      v-if="(parsedOffers.favorites || []).length > 0"
      :offers="parsedOffers.favorites"
    />

    <h5 v-if="(parsedOffers.new || []).length > 0" class="mt-4">New</h5>
    <OffersTable
      v-if="(parsedOffers.new || []).length > 0"
      :offers="parsedOffers.new"
    />

    <h5 v-if="(parsedOffers.seen || []).length > 0" class="mt-4">Seen</h5>
    <OffersTable
      v-if="(parsedOffers.seen || []).length > 0"
      :offers="parsedOffers.seen"
    />

    <h5 v-if="(parsedOffers.trash || []).length > 0" class="mt-4">Trash</h5>
    <OffersTable
      v-if="(parsedOffers.trash || []).length > 0"
      :offers="parsedOffers.trash"
    />
  </b-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import OffersTable from "@/components/OffersTable";
import _ from "lodash";

export default {
  name: "Offers",
  components: { OffersTable },
  data() {
    return {
      selectedOfferUrl: ""
    };
  },
  computed: {
    ...mapState(["userProfile"]),
    ...mapGetters(["parsedOffers", "offersLoading", "selectedOffer"]),
  },
  watch: {
    selectedOffer: async function(newValue, oldValue) {
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
      window.open(newValue.urls[0].url, "_blank");
      // } else {
      //   this.$bvModal.hide('modalEmbed');
      // }
    }
  },
  async mounted() {
    await this.$store.dispatch("fetchOffers");
  },
  methods: {
    hasSelectedOfferMoreUrls(offer) {},
    getSelectedOfferSortedUrls(offer) {},
    navigateToSelectedOfferNextUrl(offer) {},
    async toggleFavorite(offer) {
      await this.$store.dispatch("insertOrUpdateOfferState", {
        id: offer.id,
        favorite: !offer.favorite
      });
      await this.closeModal();
    },
    async toggleTrash(offer) {
      await this.$store.dispatch("insertOrUpdateOfferState", {
        id: offer.id,
        trash: !offer.trash
      });
      await this.closeModal();
    },
    async closeModal() {
      await this.$store.dispatch("setSelectedOffer", null);
    }
  }
};
</script>
