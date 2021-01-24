<template>
  <b-table :items="offers"
           :fields="fields"
           :sort-by.sync="sortBy"
           :sort-desc.sync="sortDesc"
           small
           hover
           striped
           stacked="sm">
    <template #cell(show_details)="data">
      <b-button size="sm" @click="data.toggleDetails" class="mr-2">
        {{ data.detailsShowing ? 'Less' : 'More' }}
      </b-button>
    </template>

    <template #cell(id)="data">
      <b-link target="_blank"
              rel="noopener noreferrer"
              @click="showDetail(data.item)">
        {{ data.item.id }}
      </b-link>

      <!--      <b-link target="_blank"-->
      <!--              rel="noopener noreferrer"-->
      <!--              :href="`${data.item.urls.slice(-1)[0]['url']}`">-->
      <!--        {{ data.item.id }}-->
      <!--      </b-link>-->
    </template>

    <template #cell(favorite)="data">
      <b-button size="sm"
                :variant="data.value ? 'primary' : 'outline-primary'"
                @click="toggleFavorite(data.item)">
        <b-icon icon="heart"></b-icon>
      </b-button>
    </template>

    <template #cell(archived)="data">
      <b-button size="sm"
                :variant="data.value ? 'dark' : 'outline-dark'"
                @click="toggleArchive(data.item)">
        <b-icon icon="archive"></b-icon>
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
export default {
  name: 'OffersTable',
  props: {
    fields: {},
    offers: {},
  },
  data() {
    return {
      sortBy: 'updated',
      sortDesc: true,
    }
  },
  methods: {
    showDetail(offer) {
      let result = new Promise((resolve) => this.$emit('showDetail', offer, resolve));
      result.then((value) => console.log(value))
      return result
    },
    toggleFavorite(offer) {
      let result = new Promise((resolve) => this.$emit('toggleFavorite', offer, resolve));
      result.then((value) => console.log(value))
      return result
    },
    toggleArchive(offer) {
      let result = new Promise((resolve) => this.$emit('toggleArchive', offer, resolve));
      result.then((value) => console.log(value))
      return result
    }
  }
}
</script>
