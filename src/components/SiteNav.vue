<template>
  <div>
    <b-sidebar id="sidebar-nav"
               backdrop-variant="dark"
               no-close-on-route-change
               title="Insidero Viewer"
               shadow>
      <template>
        <div class="p-2">
          <b-button-group class="mt-1 ml-3">
            <b-button
                class="py-1 px-2"
                variant="outline-primary"
                v-for="state in propertyStates"
                v-bind:key="state.text"
                :pressed="state.value === $route.query.active || ($route.query.type == null && state.value === 'all')"
                @click="setLocation(null, null, state)">
              {{ state.text }}
            </b-button>
          </b-button-group>

          <b-button-group class="mt-2 ml-3">
            <b-button
                class="py-1 px-2"
                variant="outline-primary"
                v-for="category in propertyTypes"
                v-bind:key="category.text"
                :pressed="category.value === $route.query.type || ($route.query.type == null && category.value === 'all')"
                @click="setLocation(null, category, null)">
              {{ category.text }}
            </b-button>
          </b-button-group>

          <nav class="mt-4" v-if="userLocations != null">
            <b-nav vertical pills>
              <b-nav-item
                  v-for="location in userLocations"
                  v-bind:key="location.city.value"
                  :active="isLocationActive(location)"
                  @click="setLocation(location, null, null)">
                {{ getLocationDisplayName(location) }}
              </b-nav-item>
            </b-nav>
          </nav>

          <hr class="my-3"/>

          <nav class="mt-4" v-if="isAuthenticated">
            <b-nav vertical pills>
              <b-nav-item
                  :to="{ path: 'settings' }"
                  :active="$route.path === '/settings'">
                Settings
              </b-nav-item>
              <b-nav-item v-b-toggle:sidebar-nav @click="logout()">Sign Out</b-nav-item>
            </b-nav>
          </nav>
        </div>
      </template>
    </b-sidebar>

    <b-navbar toggleable="md" type="dark" variant="primary">
      <b-button v-if="hasLocations"
                class="mr-4"
                variant="outline-light"
                v-b-toggle.sidebar-nav>
        <b-icon icon="list"></b-icon>
      </b-button>

      <b-navbar-brand :to="{ path: '/' }">Insidero Viewer</b-navbar-brand>
    </b-navbar>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import _ from "lodash";

export default {
  data() {
    return {
      propertyTypes: [
        {text: 'House', value: 'house'},
        {text: 'Flat', value: 'flat'},
        {text: 'Land', value: 'land'},
        {text: 'All', value: 'all'},
      ],
      propertyStates: [
        {text: 'Active', value: 'true'},
        {text: 'Inactive', value: 'false'},
        {text: 'All', value: 'all'},
      ],
    }
  },
  computed: {
    ...mapState(['userProfile']),
    ...mapGetters(['userLocations', 'isAuthenticated', 'isAnonymousUser']),
    hasLocations() {
      return !_.isEmpty(this.userLocations);
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    setLocation(location, category, active) {
      let newQuery = {...this.$route.query}

      if (location != null) {
        newQuery.country = location.country.value;
        newQuery.region = location.region.value;
        newQuery.city = location.city.value;
        newQuery.neighborhood = location.neighborhood?.value;
      }
      if (category != null) {
        newQuery.type = category.value;
      }
      if (active != null) {
        newQuery.active = active.value;
      }

      Object.keys(newQuery).forEach((key) => (newQuery[key] == null) && delete newQuery[key]);

      this.$router.push({path: '/offers', query: newQuery})
    },
    isLocationActive(location) {
      let match = true;
      let queryLocation = this.$route.query;
      if (queryLocation.country || location.country) {
        match = match && location.country?.value == this.$route.query.country;
      }
      if (queryLocation.region || location.region) {
        match = match && location.region?.value == this.$route.query.region;
      }
      if (queryLocation.city || location.city) {
        match = match && location.city?.value == this.$route.query.city;
      }
      if (queryLocation.neighborhood || location.neighborhood) {
        match = match && location.neighborhood?.value == this.$route.query.neighborhood;
      }
      return match;
    },
    getLocationDisplayName(location) {
      if (location.neighborhood) {
        return `${location.city.text} -> ${location.neighborhood.text}`
      } else if (location.city) {
        return `${location.city.text}`
      } else if (location.region) {
        return `${location.region.text}`
      } else {
        return `${location.country.text}`
      }
    }
  }
}
</script>
