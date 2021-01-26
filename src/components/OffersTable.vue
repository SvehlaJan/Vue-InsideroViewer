<template>
  <b-table :items="offers"
           :fields="fields"
           :sort-by.sync="sortBy"
           :sort-desc.sync="sortDesc"
           :busy="offersLoading"
           small
           hover
           striped
           stacked="sm">

    <template #cell(id)="data">
      <b-link @click="showDetail(data.item)"> {{ data.item.id }}</b-link>
    </template>

    <template #cell(controls)="data">
      <b-button size="sm"
                :variant="data.item.favorite ? 'primary' : 'outline-primary'"
                @click="toggleFavorite(data.item)">
        <b-icon icon="heart"></b-icon>
      </b-button>

      <b-button size="sm"
                class="ml-2"
                :variant="data.item.archived ? 'dark' : 'outline-dark'"
                @click="toggleArchive(data.item)">
        <b-icon icon="archive"></b-icon>
      </b-button>

      <b-button size="sm"
                class="ml-2"
                @click="data.toggleDetails">
        {{ data.detailsShowing ? 'Less' : 'More' }}
      </b-button>
    </template>

    <template #row-details="row">
      <b-card>
        <b-row no-gutters>
          <b-col md="6">
            <b-card-body title="Urls">
              <b-table :items="row.item.urls" thead-class="hidden_header">
                <template #cell(url)="data">
                  <b-link target="_blank" rel="noopener noreferrer" :href="`${data.value}`">{{ data.value }}</b-link>
                </template>
              </b-table>
            </b-card-body>
          </b-col>
          <b-col v-if="row.item.prices" md="6">
            <b-card-body title="Prices">
              <b-table :items="row.item.prices" thead-class="hidden_header"></b-table>
            </b-card-body>
          </b-col>
          <b-col v-if="row.item.updates" md="6">
            <b-card-body title="Updates">
              <b-table :items="row.item.updates" thead-class="hidden_header"></b-table>
            </b-card-body>
          </b-col>
          <b-col md="6">
            <GmapMap
                :center="row.item.marker.position"
                :zoom="11"
                :options="{
                      gestureHandling: 'greedy',
                    }"
                map-type-id="terrain"
                style="width: 500px; height: 300px">
              <GmapMarker
                  :key="row.item.id"
                  :position="row.item.marker.position"/>
            </GmapMap>
          </b-col>
        </b-row>
      </b-card>
    </template>
  </b-table>
</template>
<script>

import {mapGetters} from "vuex";

export default {
  name: 'OffersTable',
  props: {
    fields: {},
    offers: {},
  },
  computed: {
    ...mapGetters(['offersLoading']),
  },
  data() {
    return {
      sortBy: 'updated',
      sortDesc: true,
    }
  },
  methods: {
    showDetail(offer) {
      this.$store.dispatch('setSelectedOffer', offer)
    },
    toggleFavorite(offer) {
      const newValue = (offer.category === 1) ? 0 : 1;
      this.$store.dispatch('updateOfferCategory', {offer: offer, category: newValue})
    },
    toggleArchive(offer) {
      const newValue = (offer.category === 10) ? 0 : 10;
      this.$store.dispatch('updateOfferCategory', {offer: offer, category: newValue})
    }
  }
}
</script>
