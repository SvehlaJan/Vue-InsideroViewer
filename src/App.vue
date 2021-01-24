<template>
  <b-container id="app">
    <SiteNav/>
    <router-view/>
  </b-container>
</template>

<script>
import SiteNav from "@/components/SiteNav";

export default {
  name: 'App',
  components: {
    SiteNav
  },
}
</script>


<style lang="scss" scoped>
.md-app {
  min-height: 350px;
  border: 1px solid rgba(#000, .12);
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>
