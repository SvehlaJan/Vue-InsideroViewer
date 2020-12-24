<template>
  <b-navbar toggleable="md" type="dark" variant="primary">
    <b-navbar-brand :to="{ path: '/' }">Insidero Viewer</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="isLoggedIn">
        <b-nav-item
            v-for="location in userProfile.userLocations"
            v-bind:key="location.city.value"
            :active="location.city.value === $route.query.city"
            @click="setLocation(location)">
          {{ location.city.text }}
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item v-if="!isLoggedIn" :to="{ path: 'login' }">Login</b-dropdown-item>
          <b-dropdown-item v-if="isLoggedIn" :to="{ path: 'settings' }">Settings</b-dropdown-item>
          <b-dropdown-item v-if="isLoggedIn" @click="logout()">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import {mapState} from 'vuex'
import {auth} from '@/firebase'

export default {
  data() {
    return {
      currentQuery: {},
    }
  },
  computed: {
    ...mapState(['userProfile']),
    isLoggedIn() {
      const loggedIn = auth.currentUser != null;
      // console.log("SiteNav: Logged in: ", loggedIn, " user: ", auth.currentUser)
      return loggedIn
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    setLocation(location) {
      const query = {
        country: location.country.value,
        region: location.region.value,
        city: location.city.value,
      }
      this.$router.push({path: '/offers', query: query})
    },
  }
}
</script>
