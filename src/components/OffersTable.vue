<template>
  <b-table :items="offers"
           :fields="fields"
           :sort-by.sync="sortBy"
           :sort-desc.sync="sortDesc"
           :busy="offersLoading"
           ref="table"
           selectable
           select-mode="single"
           small
           hover
           striped
           stacked="sm">

    <template #cell(id)="data">
      <b-link @click="showEmbeddedPage(data.item)"> {{ data.item.id }}</b-link>
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
                @click="showDetails(data)">
        {{ data.detailsShowing ? 'Less' : 'More' }}
      </b-button>
    </template>

    <template #row-details="row">
      <b-row>
        <b-col cols="12" sm="6" no-gutters v-if="row.item.urls">
          <b-card>
            <b-table :items="row.item.urls" :fields="[{key: 'url', name: 'url', tdClass: 'truncate'}]">
              <template #cell(url)="data">
                <b-link style target="_blank" rel="noopener noreferrer" :href="`${data.value}`">{{
                    data.value
                  }}
                </b-link>
              </template>
            </b-table>
          </b-card>
        </b-col>
        <b-col cols="12" sm="6" no-gutters v-if="row.item.prices">
          <b-card>
            <b-table :items="row.item.prices" thead-class="hidden_header"></b-table>
          </b-card>
        </b-col>
        <b-col cols="12" sm="6" no-gutters v-if="row.item.updates">
          <b-card>
            <b-table :items="row.item.updates" thead-class="hidden_header"></b-table>
          </b-card>
        </b-col>
        <b-col cols="12" sm="6" no-gutters>
          <b-card>
            <b-aspect aspect="10:7">
              <GmapMap
                  :center="row.item.marker.position"
                  :zoom="11"
                  :options="{gestureHandling: 'greedy'}"
                  map-type-id="terrain"
                  style="width: 100%; height: 100%">
                <GmapMarker
                    :key="row.item.id"
                    :position="row.item.marker.position"/>
              </GmapMap>
            </b-aspect>
          </b-card>
        </b-col>
      </b-row>

      <!--      <b-card-group columns>-->
      <!--        <b-card title="Urls" v-if="row.item.urls">-->
      <!--          <b-table :items="row.item.urls" thead-class="hidden_header">-->
      <!--            <template #cell(url)="data">-->
      <!--              <b-link target="_blank" rel="noopener noreferrer" :href="`${data.value}`">{{ data.value }}</b-link>-->
      <!--            </template>-->
      <!--          </b-table>-->
      <!--        </b-card>-->
      <!--        <b-card title="Prices" v-if="row.item.prices">-->
      <!--          <b-table :items="row.item.prices" thead-class="hidden_header"></b-table>-->
      <!--        </b-card>-->
      <!--        <b-card title="Updates" v-if="row.item.updates">-->
      <!--          <b-table :items="row.item.updates" thead-class="hidden_header"></b-table>-->
      <!--        </b-card>-->
      <!--        <b-card>-->
      <!--          <b-aspect aspect="10:7">-->
      <!--            <GmapMap-->
      <!--                :center="row.item.marker.position"-->
      <!--                :zoom="11"-->
      <!--                :options="{gestureHandling: 'greedy'}"-->
      <!--                map-type-id="terrain"-->
      <!--                style="width: 500px; height: 300px;">-->
      <!--              <GmapMarker-->
      <!--                  :key="row.item.id"-->
      <!--                  :position="row.item.marker.position"/>-->
      <!--            </GmapMap>-->
      <!--          </b-aspect>-->
      <!--        </b-card>-->
      <!--      </b-card-group>-->
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
    showDetails(row) {
      row.toggleDetails();
      this.$refs.table.selectRow(this.$refs.table.sortedItems.indexOf(row.item))
    },
    showEmbeddedPage(offer) {
      this.$refs.table.selectRow(this.$refs.table.sortedItems.indexOf(offer))
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

<style>
.truncate {
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
