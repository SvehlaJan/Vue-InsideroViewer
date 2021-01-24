<template>
  <b-container>
    <b-sidebar id="sidebar-nav"
               backdrop-variant="dark"
               v-model="isSidebarVisible"
               no-close-on-route-change="false"
               shadow>
      <template>
        <div class="p-2">
          <b-button-group class="mt-3">
            <b-button
                variant="outline-primary"
                v-for="state in propertyStates"
                v-bind:key="state.text"
                :pressed="state.value == $route.query.active"
                @click="setLocation(null, null, state)">
              {{ state.text }}
            </b-button>
          </b-button-group>

          <b-button-group class="mt-2">
            <b-button
                variant="outline-primary"
                v-for="category in propertyTypes"
                v-bind:key="category.text"
                :pressed="category.value == $route.query.type"
                @click="setLocation(null, category, null)">
              {{ category.text }}
            </b-button>
          </b-button-group>

          <nav class="mt-5">
            <b-nav vertical pills>
              <b-nav-item
                  v-for="location in userProfile.userLocations"
                  v-bind:key="location.city.value"
                  :active="isLocationActive(location)"
                  @click="setLocation(location, null, null)">
                {{ getLocationDisplayName(location) }}
              </b-nav-item>
            </b-nav>
          </nav>

          <nav class="mt-5" v-if="isLoggedIn">
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
  </b-container>
</template>

<script>
import {mapState} from 'vuex'
import {auth} from '@/firebase'
import _ from "lodash";

export default {
  data() {
    return {
      propertyTypes: [
        {text: 'House', value: 'house'},
        {text: 'Flat', value: 'flat'},
        {text: 'Land', value: 'land'},
        {text: 'All', value: null},
      ],
      propertyStates: [
        {text: 'Active', value: 'true'},
        {text: 'Inactive', value: 'false'},
        {text: 'All', value: null},
      ],
    }
  },
  computed: {
    ...mapState(['userProfile', 'sideBarVisible']),
    isLoggedIn() {
      return auth.currentUser != null;
    },
    hasLocations() {
      return !_.isEmpty(this.userProfile?.userLocations);
    },
    isSidebarVisible() {
      return this.sideBarVisible;
    },
  },
  watch: {
    'sideBarVisible': function (newValue, oldValue) {
    }
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
        match &= location.country?.value == this.$route.query.country;
      }
      if (queryLocation.region || location.region) {
        match &= location.region?.value == this.$route.query.region;
      }
      if (queryLocation.city || location.city) {
        match &= location.city?.value == this.$route.query.city;
      }
      if (queryLocation.neighborhood || location.neighborhood) {
        match &= location.neighborhood?.value == this.$route.query.neighborhood;
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
