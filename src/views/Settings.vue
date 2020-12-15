<template>
  <b-container>
    <section id="settings">
      <h3>Settings</h3>

      <b-alert v-model="showSuccess" variant="success" show>Success</b-alert>

      <b-modal id="modal-location" size="lg" @ok="handleOk" title="BootstrapVue">
        <form ref="form" @submit.stop.prevent="handleAddNewLocation">
          <b-form-select v-model="countryForm.selectedItem"
                         :options="countryForm.items"
                         v-on:change="getRegions($event)"
                         class="mb-3">
            <template #first>
              <b-form-select-option :value="''" disabled>-- Please select a country --</b-form-select-option>
            </template>
          </b-form-select>

          <b-form-select v-model="regionForm.selectedItem"
                         :options="regionForm.items"
                         :disabled="countryForm.selectedItem === '' || regionForm.items.length === 0"
                         class="mb-3">
            <template #first>
              <b-form-select-option :value="''" disabled>-- Please select a region --</b-form-select-option>
            </template>
          </b-form-select>

          <vue-typeahead-bootstrap
              :data="cityForm.items"
              v-model="cityForm.searchQuery"
              size="lg"
              :serializer="s => s.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')"
              placeholder="Type a city name..."
              :disabled="regionForm.selectedItem === ''"
              @hit="cityForm.selectedItem = $event"/>
        </form>
      </b-modal>

      <b-form @submit.prevent="updateProfile()">
        <b-card-group deck>
          <b-card title="Profile">
            <b-form-group id="input-group-1" label="Insidero API Key" label-for="input-1">
              <b-form-input
                  id="input-1"
                  v-model="userProfile.apiKey"
                  required>
              </b-form-input>
            </b-form-group>
          </b-card>

          <b-card title="Locations">
            <b-table :items="userProfile.userLocations || []" :fields="['country', 'region', 'city', 'delete']">
              <template #cell(delete)="data">
                <b-button size="sm" @click="handleDeleteLocation(data.item)">
                  Delete
                </b-button>
              </template>

              <template #cell()="data">
                {{ data.value.text }}
              </template>
            </b-table>
            <b-button v-b-modal="'modal-location'" variant="primary">Add location</b-button>
          </b-card>
        </b-card-group>

        <b-button type="submit" variant="primary">Update Profile</b-button>
      </b-form>
    </section>
  </b-container>
</template>

<script>
import {mapState} from 'vuex'
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap'
import _ from 'lodash'

export default {
  data() {
    return {
      isLoading: false,
      showSuccess: false,
      newLocationState: {},
      countryForm: {
        items: [],
        selectedItem: '',
        searchQuery: '',
      },
      regionForm: {
        items: [],
        selectedItem: '',
        searchQuery: '',
      },
      cityForm: {
        items: [],
        selectedItem: '',
        searchQuery: '',
      },
      getCitiesDebounced: _.debounce(function (countryId, regionId, searchQuery) {
        if (searchQuery.length >= 3) {
          this.getCities(countryId, regionId, searchQuery)
        }
      }, 500)
    }
  },
  mounted() {
    if (Object.keys(this.userProfile).length > 0) {
      this.getCountries()
    }
  },
  components: {
    VueTypeaheadBootstrap
  },
  computed: {
    ...mapState(['userProfile']),
  },
  watch: {
    'cityForm.searchQuery': function (newVal, oldVal) {
      this.getCitiesDebounced(this.countryForm.selectedItem, this.regionForm.selectedItem, this.cityForm.searchQuery)
    },
    userProfile: function (newValue, oldValue) {
      if (Object.keys(newValue).length >= 0 &&
          this.countryForm.items.length === 0 &&
          this.isLoading === false) {
        this.getCountries()
      }
    },
  },
  methods: {
    updateProfile() {
      this.$store.dispatch('updateProfile', {
        apiKey: this.userProfile.apiKey || "",
        userLocations: this.userProfile.userLocations || [],
        offersHistory: this.userProfile.offersHistory || [],
      })

      this.showSuccess = true

      setTimeout(() => {
        this.showSuccess = false
      }, 2000)
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.newLocationState["country"] = valid
      return valid
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleAddNewLocation()
    },
    handleAddNewLocation() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }

      const selectedCountry = _.find(this.countryForm.items, {value: this.countryForm.selectedItem})
      const selectedRegion = _.find(this.regionForm.items, {value: this.regionForm.selectedItem})
      this.userProfile.userLocations.push(
          {
            country: selectedCountry,
            region: selectedRegion,
            city: this.cityForm.selectedItem
          }
      );
      this.updateProfile();

      this.cityForm = {
        items: [],
        selectedItem: '',
        searchQuery: '',
      };

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-location')
      })
    },
    handleDeleteLocation(location) {
      const index = this.userProfile.userLocations.indexOf(location);
      this.userProfile.userLocations.splice(index, 1)
      this.updateProfile();
    },
    getCountries() {
      const params = {
        api_key: this.userProfile.apiKey,
      }
      Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
      const paramsStr = new URLSearchParams(params).toString();
      this.$axios
          .get("/countries?" + paramsStr)
          .then(response => {
            const countries = Object.values(response.data.results).map(function (country) {
              return {
                value: country['general']['id'],
                text: country['general']['name'],
              };
            });
            console.log("Countries received: ", countries.length)
            return (this.countryForm.items = countries);
          })
          .catch(err => {
            console.log(err.response);
          });
    },
    getRegions(country) {
      this.regionForm = {
        items: [],
        selectedItem: '',
        searchQuery: '',
      };
      this.cityForm = {
        items: [],
        selectedItem: '',
        searchQuery: '',
      };

      const params = {
        api_key: this.userProfile.apiKey,
        country: country,
      }
      Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
      const paramsStr = new URLSearchParams(params).toString();
      this.$axios
          .get("/regions?" + paramsStr)
          .then(response => {
            const regions = Object.values(response.data.results).map(function (region) {
              return {
                value: region['general']['id'],
                text: region['general']['name'],
              };
            });
            console.log("Regions received: ", regions.length)
            return (this.regionForm.items = regions);
          })
          .catch(err => {
            console.log(err.response);
          });
    },
    getCities(country, region, name) {
      const params = {
        api_key: this.userProfile.apiKey,
        country: country,
        region: region,
        name: name,
      }
      Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
      const paramsStr = new URLSearchParams(params).toString();
      this.$axios
          .get("/cities?" + paramsStr)
          .then(response => {
            const cities = Object.values(response.data.results).map(function (city) {
              return {
                value: city['general']['id'],
                text: city['general']['name'],
              };
            });
            console.log("Cities received: ", cities.length)
            return (this.cityForm.items = cities);
          })
          .catch(err => {
            console.log(err.response);
          });
    },
  }
}
</script>
