<script>
import {POINT_MARKER_ICON_CONFIG} from "@/constants/mapSettings";

export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },

  mounted() {
    const {Marker} = this.google.maps;

    new Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      icon: POINT_MARKER_ICON_CONFIG
    });
  },

  // render(createElement, context) {
  //
  // }
  // render() {
  //   return '';
  // }

  render (h) {
    if (!this.$slots.default || this.$slots.default.length === 0) {
      return ''
    } else if (this.$slots.default.length === 1) {
      // So that infowindows can have a marker parent
      return this.$slots.default[0]
    } else {
      return h(
          'div',
          this.$slots.default
      )
    }
  }
};
</script>