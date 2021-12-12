<template>
  <div id="app">
    <SiteNav />
    <router-view />
  </div>
</template>

<script>
import SiteNav from "@/components/SiteNav";

export default {
  name: "App",
  components: {
    SiteNav
  }
};
</script>
