<template>
  <div>
    <b-sidebar
      id="sidebar-nav"
      backdrop-variant="dark"
      :no-close-on-route-change="!this.$isMobile()"
      title="Insidero Viewer"
      shadow
    >
      <div class="p-2">
        <b-button-group class="mt-1 ml-3">
          <b-button
            v-for="state in propertyStates"
            :key="state.text"
            class="py-1 px-2"
            variant="outline-primary"
            :pressed="
              state.value === activeFilter ||
              (activeFilter == null && state.value === 'all')
            "
            @click="setState(state)"
          >
            {{ state.text }}
          </b-button>
        </b-button-group>

        <b-button-group class="mt-2 ml-3">
          <b-button
            v-for="category in propertyTypes"
            :key="category.text"
            class="py-1 px-2"
            variant="outline-primary"
            :pressed="
              category.value === propertyType ||
              (propertyType == null && category.value === 'all')
            "
            @click="setCategory(category)"
          >
            {{ category.text }}
          </b-button>
        </b-button-group>

        <b-form-group
          label="Min space"
          label-for="space_min"
          class="mt-3 ml-3 mr-4"
        >
          <b-form-input
            id="space_min"
            v-model="spaceMin"
            placeholder="Min m2"
            type="number"
            min="0"
          >
          </b-form-input>
        </b-form-group>

        <nav v-if="hasSavedLocations" class="mt-4">
          <b-nav vertical pills>
            <b-nav-item
              v-for="location in savedLocationsArray"
              :key="location.city.value"
              :active="isLocationActive(location)"
              @click="setLocation(location)"
            >
              {{ getLocationDisplayName(location) }}
            </b-nav-item>
          </b-nav>
        </nav>

        <hr class="my-3" />

        <nav v-if="isAuthenticated" class="mt-4">
          <b-nav vertical pills>
            <b-nav-item
              :to="{ path: 'settings' }"
              :active="$route.path === '/settings'"
            >
              Settings
            </b-nav-item>
            <b-nav-item v-b-toggle:sidebar-nav @click="logout()"
              >Sign Out</b-nav-item
            >
          </b-nav>
        </nav>
      </div>
    </b-sidebar>

    <b-navbar toggleable="md" type="dark" variant="primary">
      <b-button v-b-toggle.sidebar-nav class="mr-4" variant="outline-light">
        <b-icon icon="list"></b-icon>
      </b-button>

      <b-navbar-brand :to="{ path: '/' }">Insidero Viewer</b-navbar-brand>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      propertyTypes: [
        { text: "House", value: "house" },
        { text: "Flat", value: "flat" },
        { text: "Land", value: "land" },
        { text: "All", value: "all" }
      ],
      propertyStates: [
        { text: "Active", value: "true" },
        { text: "Inactive", value: "false" },
        { text: "All", value: "all" }
      ],
      spaceMin: this.$store.getters.spaceMin
    };
  },
  computed: {
    ...mapGetters([
      "savedLocationsArray",
      "hasSavedLocations",
      "isAuthenticated",
      "isAnonymousUser",
      "activeFilter",
      "propertyType"
    ])
  },
  watch: {
    spaceMin: function (val, oldVal) {
      this.setSpaceMinDebounced(val);
    }
  },
  methods: {
    setSpaceMinDebounced: _.debounce(async function (spaceMin) {
      await this.$store.dispatch("setSearchParams", { spaceMin: spaceMin });
    }, 500),
    async setLocation(location) {
      // let newQuery = { ...this.$route.query };
      // newQuery.country = location.country.value;
      // newQuery.region = location.region.value;
      // newQuery.city = location.city.value;
      // newQuery.neighborhood = location.neighborhood?.value;
      // this.$router.push({ path: "/offers", query: newQuery });
      await this.$store.dispatch("setSearchParams", {
        country: location.country.value,
        region: location.region.value,
        city: location.city.value,
        neighborhood: location.neighborhood?.value
      });
    },
    async setCategory(category) {
      // let newQuery = { ...this.$route.query };
      // newQuery.type = category.value;
      // this.$router.push({ path: "/offers", query: newQuery });
      await this.$store.dispatch("setSearchParams", {
        propertyType: category.value
      });
    },
    async setState(activeFilter) {
      // let newQuery = { ...this.$route.query };
      // newQuery.activeFilter = activeFilter.value;
      // this.$router.push({ path: "/offers", query: newQuery });
      await this.$store.dispatch("setSearchParams", {
        activeFilter: activeFilter.value
      });
    },
    logout() {
      this.$store.dispatch("logout");
    },
    isLocationActive(location) {
      let match = true;
      const searchParams = this.$store.getters.searchParams;
      if (searchParams.country || location.country) {
        match = match && location.country?.value == searchParams.country;
      }
      if (searchParams.region || location.region) {
        match = match && location.region?.value == searchParams.region;
      }
      if (searchParams.city || location.city) {
        match = match && location.city?.value == searchParams.city;
      }
      if (searchParams.neighborhood || location.neighborhood) {
        match =
          match && location.neighborhood?.value == searchParams.neighborhood;
      }
      return match;
    },
    getLocationDisplayName(location) {
      if (location.neighborhood) {
        return `${location.city.text} -> ${location.neighborhood.text}`;
      } else if (location.city) {
        return `${location.city.text}`;
      } else if (location.region) {
        return `${location.region.text}`;
      } else {
        return `${location.country.text}`;
      }
    }
  }
};
</script>
