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
  }
}
</script>