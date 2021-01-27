<template>
  <b-container>

    <b-alert v-model="showSuccess" variant="success" show>Success</b-alert>

    <b-modal id="modal-location" size="lg" @ok="handleOk" title="Add location">
      <form ref="form" @submit.stop.prevent="handleAddNewLocation">
        <b-form-select v-model="countryForm.selectedItem"
                       :options="locationSearchCountries"
                       :disabled="!locationSearchCountries"
                       v-on:change="getRegions($event)"
                       class="mb-3">
          <template #first>
            <b-form-select-option :value="''" disabled>-- Please select a country --</b-form-select-option>
          </template>
        </b-form-select>

        <b-form-select v-model="regionForm.selectedItem"
                       :options="locationSearchRegions"
                       :disabled="countryForm.selectedItem === '' || !locationSearchRegions"
                       class="mb-3">
          <template #first>
            <b-form-select-option :value="''" disabled>-- Please select a region --</b-form-select-option>
          </template>
        </b-form-select>

        <vue-typeahead-bootstrap
            class="mb-3"
            :data="locationSearchCities"
            v-model="cityForm.searchQuery"
            :serializer="s => s.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')"
            placeholder="Type a city name..."
            :disabled="regionForm.selectedItem === ''"
            @hit="cityForm.selectedItem = $event"/>

        <vue-typeahead-bootstrap
            :data="locationSearchNeighborhoods"
            v-model="neighborhoodForm.searchQuery"
            :serializer="s => s.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')"
            placeholder="Type a neighborhood name..."
            :disabled="cityForm.selectedItem === ''"
            @hit="neighborhoodForm.selectedItem = $event"/>
      </form>
    </b-modal>

    <b-card title="Insidero API Key" class="mt-4">
      <b-form-group id="input-group-1" label-for="input-1" class="mt-4">
        <b-form-input
            id="input-1"
            debounce="1000"
            type="text"
            v-model="apiKey"
            required>
        </b-form-input>
        <div>
          <p>You can get one from
            <b-link target="_blank" rel="noopener noreferrer" href="https://www.insidero.com/registrace">Insidero
            </b-link>
          </p>
        </div>
      </b-form-group>
    </b-card>

    <b-card title="Locations" class="mt-4">
      <b-table :items="userProfile.userLocations || []"
               :fields="['country', 'region', 'city', 'neighborhood', 'delete']">
        <template #cell(delete)="data">
          <b-button size="sm" @click="handleDeleteLocation(data.item)">
            Delete
          </b-button>
        </template>

        <template #cell()="data">
          {{ data.value.text }}
        </template>
      </b-table>
      <b-button v-b-modal="'modal-location'" :disabled="!isApiKey" variant="primary">Add
        location
      </b-button>
    </b-card>

    <b-card v-if="userProfile.isAnonymous" title="Create Account" class="mt-4">
      <!--      <b-form @submit.prevent="createAccountForAnonymousUser()">-->

      <!--        <b-alert v-model="showSuccess" variant="success" show>Success</b-alert>-->
      <!--        <b-alert v-model="showError" variant="danger" show>{{ errorMessage }}</b-alert>-->

      <!--        <b-form-group id="input-group-3" label="Email address:" label-for="email2" class="mt-4">-->
      <!--          <b-form-input-->
      <!--              id="email2"-->
      <!--              v-model="loginForm.email"-->
      <!--              type="email"-->
      <!--              required-->
      <!--              placeholder="Enter email">-->
      <!--          </b-form-input>-->
      <!--        </b-form-group>-->

      <!--        <b-form-group id="input-group-4" label="Password:" label-for="password2">-->
      <!--          <b-form-input-->
      <!--              id="password2"-->
      <!--              v-model="loginForm.password"-->
      <!--              type="password"-->
      <!--              required-->
      <!--              placeholder="******">-->
      <!--          </b-form-input>-->
      <!--        </b-form-group>-->

      <!--        <b-container>-->
      <!--          <b-row>-->
      <!--            <b-button type="submit" variant="primary">Register</b-button>-->
      <!--          </b-row>-->
      <!--          <b-row class="mt-4">-->
      <!--            <b-link @click="toggleForm()">Back to Log In</b-link>-->
      <!--          </b-row>-->
      <!--        </b-container>-->
      <!--      </b-form>-->
    </b-card>
    <b-card v-else title="Profile" class="mt-4">
    </b-card>
  </b-container>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap'
import _ from 'lodash'
import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      showSuccess: false,
      newLocationState: {},
      countryForm: {
        selectedItem: '',
        searchQuery: '',
      },
      regionForm: {
        selectedItem: '',
        searchQuery: '',
      },
      cityForm: {
        selectedItem: '',
        searchQuery: '',
      },
      neighborhoodForm: {
        selectedItem: '',
        searchQuery: '',
      },
      apiKey: '',
      getCitiesDebounced: _.debounce(function (countryId, regionId, citySearchQuery) {
        if (citySearchQuery.length >= 3) {
          this.getCities(countryId, regionId, citySearchQuery)
        }
      }, 500),
      getNeighborhoodsDebounced: _.debounce(function (countryId, regionId, cityId, neighborhoodSearchQuery) {
        if (neighborhoodSearchQuery.length >= 3) {
          this.getNeighborhoods(countryId, regionId, cityId, neighborhoodSearchQuery)
        }
      }, 500)
    }
  },
  mounted() {
    if (!_.isEmpty(this.userProfile?.apiKey)) {
      this.apiKey = this.userProfile?.apiKey
      this.getCountries()
    }
  },
  components: {
    VueTypeaheadBootstrap
  },
  computed: {
    ...mapState(['userProfile', 'locationSearchCountries', 'locationSearchRegions', 'locationSearchCities', 'locationSearchNeighborhoods']),
    isApiKey() {
      return !_.isEmpty(this.apiKey)
    }
  },
  watch: {
    'cityForm.searchQuery': function (newVal, oldVal) {
      this.getCitiesDebounced(this.countryForm.selectedItem, this.regionForm.selectedItem, this.cityForm.searchQuery)
    },
    'neighborhoodForm.searchQuery': function (newVal, oldVal) {
      this.getNeighborhoodsDebounced(this.countryForm.selectedItem, this.regionForm.selectedItem, this.cityForm.selectedItem.value, this.neighborhoodForm.searchQuery)
    },
    'userProfile.apiKey': function (newValue, oldValue) {
      if (!_.isEmpty(newValue)) {
        if (_.isEmpty(oldValue)) {
          this.apiKey = newValue;
        }

        this.getCountries();
      }
    },
    'apiKey': function (newValue, oldValue) {
      if (this.userProfile?.apiKey != newValue) {
        this.updateProfile();
      }
    },
  },
  methods: {
    updateProfile() {
      this.$store.dispatch('updateProfile', {
        apiKey: this.apiKey || "",
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
    createAccountForAnonymousUser(form) {

    },
    handleAddNewLocation() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }

      const selectedCountry = _.find(this.locationSearchCountries, {value: this.countryForm.selectedItem})
      const selectedRegion = _.find(this.locationSearchRegions, {value: this.regionForm.selectedItem})
      this.userProfile.userLocations.push(
          {
            country: selectedCountry,
            region: selectedRegion,
            city: this.cityForm.selectedItem,
            neighborhood: this.neighborhoodForm.selectedItem,
          }
      );
      this.updateProfile();

      this.cityForm = {
        selectedItem: '',
        searchQuery: '',
      };
      this.neighborhoodForm = {
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
      this.$store.dispatch('fetchCountries')
    },
    getRegions(country) {
      this.regionForm = {
        selectedItem: '',
        searchQuery: '',
      };
      this.cityForm = {
        selectedItem: '',
        searchQuery: '',
      };
      this.neighborhoodForm = {
        selectedItem: '',
        searchQuery: '',
      };
      this.$store.dispatch('fetchRegions', {country: country})
    },
    getCities(country, region, name) {
      this.neighborhoodForm = {
        selectedItem: '',
        searchQuery: '',
      };

      this.$store.dispatch('fetchCities', {country: country, region: region, name: name,})
    },
    getNeighborhoods(country, region, city, name) {
      this.$store.dispatch('fetchNeighborhoods', {country: country, region: region, city: city, name: name,})
    },
  }
}
</script>
