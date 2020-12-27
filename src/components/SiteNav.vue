<template>
  <b-container>
    <b-sidebar id="sidebar-nav"
               aria-labelledby="sidebar-no-header-title"
               backdrop-variant="dark"
               backdrop
               no-header
               shadow>
      <template>
        <div class="p-3">
          <h4 id="sidebar-no-header-title">Lorem ipsum</h4>

          <b-button-group>
            <b-button
                class="mt-3"
                variant="outline-primary"
                v-for="category in options"
                v-bind:key="category.text"
                :pressed="category.value == $route.query.type"
                @click="setLocation(null, category)">
              {{ category.text }}
            </b-button>
          </b-button-group>

          <nav class="mt-3">
            <b-nav vertical pills>
              <b-nav-item
                  v-for="location in userProfile.userLocations"
                  v-bind:key="location.city.value"
                  :active="location.city.value == $route.query.city"
                  @click="setLocation(location, null)">
                {{ location.city.text }}
              </b-nav-item>
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

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto" v-if="isLoggedIn">
          <b-nav-item-dropdown right>
            <template #button-content>
              <b-icon icon="person-fill"></b-icon>
            </template>
            <b-dropdown-item v-if="isLoggedIn" :to="{ path: 'settings' }">Settings</b-dropdown-item>
            <b-dropdown-item v-if="isLoggedIn" @click="logout()">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
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
      options: [
        {text: 'House', value: 'house'},
        {text: 'Flat', value: 'flat'},
        {text: 'Land', value: 'land'},
        {text: 'All', value: null},
      ]
    }
  },
  computed: {
    ...mapState(['userProfile']),
    isLoggedIn() {
      return auth.currentUser != null;
    },
    hasLocations() {
      return !_.isEmpty(this.userProfile?.userLocations);
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    setLocation(location, category) {
      let newQuery = {...this.$route.query}

      if (location != null) {
        newQuery.country = location.country.value;
        newQuery.region = location.region.value;
        newQuery.city = location.city.value;
      }
      if (category != null) {
        newQuery.type = category.value;
      }
      
      Object.keys(newQuery).forEach((key) => (newQuery[key] == null) && delete newQuery[key]);

      this.$router.push({path: '/offers', query: newQuery})
    },
  }
}
</script>
