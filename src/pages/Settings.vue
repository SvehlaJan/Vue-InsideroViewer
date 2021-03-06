<template>
  <b-container>

    <b-alert class="mt-4" v-model="locationsFormStatus.showSuccess" variant="success" show>Success</b-alert>
    <b-alert class="mt-4" v-model="locationsFormStatus.showError" variant="danger" show>
      {{ locationsFormStatus.errorMessage }}
    </b-alert>

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
            type="text"
            v-model="apiKey"
            required>
        </b-form-input>
        <div>
          <p>You can get one from
            <b-link target="_blank" rel="noopener noreferrer" href="https://www.insidero.com/registrace">Insidero</b-link>.
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
      <b-button v-b-modal="'modal-location'" :disabled="!isApiKey" variant="primary">Add location</b-button>
    </b-card>

    <b-card v-if="userProfile.isAnonymous" title="Create Account" class="mt-4">
      <p>Your locations and favorite offers will be saved.</p>
      <EmailCredentialsForm
          @submitForm="createAccountForAnonymousUser"
          :error-message="accountFormStatus.errorMessage"
          :show-error="accountFormStatus.showError"
          :show-success="accountFormStatus.showSuccess"
          submit-button-label="Register"/>
    </b-card>
    <b-card v-else title="Profile" class="mt-4">
      <ChangePasswordForm
          @submitForm="changeUserPassword"
          :error-message="accountFormStatus.errorMessage"
          :show-error="accountFormStatus.showError"
          :show-success="accountFormStatus.showSuccess"
          submit-button-label="Change password"/>
    </b-card>
  </b-container>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap'
import _ from 'lodash'
import EmailCredentialsForm from "@/components/EmailCredentialsForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default {
  data() {
    return {
      locationsFormStatus: {
        showSuccess: false,
        showError: false,
        errorMessage: '',
      },
      accountFormStatus: {
        showSuccess: false,
        showError: false,
        errorMessage: '',
      },
      pendingApiKeyTest: false,
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
    VueTypeaheadBootstrap,
    EmailCredentialsForm,
    ChangePasswordForm,
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
        this.pendingApiKeyTest = true
        this.updateProfile();
      }
    },
  },
  methods: {
    async updateProfile() {
      await this.$store.dispatch('updateProfile', {
        apiKey: this.apiKey || "",
        userLocations: this.userProfile.userLocations || [],
        offersHistory: this.userProfile.offersHistory || [],
      })
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
    async createAccountForAnonymousUser(formData) {
      try {
        await this.$store.dispatch('createAccountForAnonymousUser', {
          email: formData.email,
          password: formData.password,
        })

        this.accountFormStatus.showError = false
        this.accountFormStatus.showSuccess = true
      } catch (error) {
        if (error.code) {
          this.accountFormStatus.errorMessage = error.message
          this.accountFormStatus.showError = true
        } else {
          console.error("Create account error: ", error)
        }
      }
    },
    async changeUserPassword(formData) {
      try {
        await this.$store.dispatch('changeUserPassword', {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })

        this.accountFormStatus.showError = false
        this.accountFormStatus.showSuccess = true
      } catch (error) {
        if (error.code) {
          if (error.code === "auth/wrong-password") {
            this.accountFormStatus.errorMessage = "Current password is invalid or the user does not have a password.";
          } else {
            this.accountFormStatus.errorMessage = error.message;
          }
          this.accountFormStatus.showError = true
        } else {
          console.error("Create account error: ", error)
        }
      }
    },
    async handleAddNewLocation() {
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
      await this.updateProfile();

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
    async handleDeleteLocation(location) {
      const index = this.userProfile.userLocations.indexOf(location);
      this.userProfile.userLocations.splice(index, 1)
      await this.updateProfile();
    },
    async getCountries() {
      this.resetForm(this.countryForm)
      this.resetForm(this.regionForm)
      this.resetForm(this.cityForm)
      this.resetForm(this.neighborhoodForm)

      try {
        await this.$store.dispatch('fetchCountries')

        if (this.pendingApiKeyTest) {
          this.pendingApiKeyTest = false;
          this.locationsFormStatus.showSuccess = true;
          this.locationsFormStatus.showError = false;
          setTimeout(() => {
            this.locationsFormStatus.showSuccess = false;
          }, 2000);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.data?.error?.message) {
            this.locationsFormStatus.errorMessage = error.response.data?.error?.message
            this.locationsFormStatus.showError = true
          } else {
            this.locationsFormStatus.errorMessage = `Error code: ${error.response.status}, message : ${error.response.statusText}`
            this.locationsFormStatus.showError = true
          }
        } else {
          console.error("Countries fetch error: ", error)
        }
      }
    },
    async getRegions(country) {
      this.resetForm(this.regionForm)
      this.resetForm(this.cityForm)
      this.resetForm(this.neighborhoodForm)

      await this.$store.dispatch('fetchRegions', {country: country})
    },
    async getCities(country, region, name) {
      this.resetForm(this.neighborhoodForm)

      await this.$store.dispatch('fetchCities', {country: country, region: region, name: name,})
    },
    async getNeighborhoods(country, region, city, name) {
      await this.$store.dispatch('fetchNeighborhoods', {country: country, region: region, city: city, name: name,})
    },
    resetForm(form) {
      form = {
        selectedItem: '',
        searchQuery: '',
      }
    },
  }
}
</script>
