<template>
  <div>
    <div id="main-map">
      <div class="mapboxgl-ctrl-bottom-right third-party-container">
        <a
          v-for="logo in $mainConfig['map-logos']"
          :key="logo.link"
          :href="logo.link"
          target="_blank"
        >
          <img class="third-party-logo" :src="logo['img-src']" />
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";

import Vue from "vue";
import { EventBus } from "../js/DataManagement/EventBus";
import EventManager from "../js/DataManagement/EventMangager";
export default {
  name: "Map",
  data: function () {
    return {};
  },
  mounted: function () {
    mapboxgl.accessToken = this.$mainConfig.api.keys.CUNYMapBoxKey;
    this.map = new mapboxgl.Map(this.$mainConfig.mapConfig);
    let map = (Vue.prototype.$map = this.map);
    Vue.prototype.$eventManager = new EventManager();

    let self = this;

    this.map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

    map.once("idle", () => {
      self.$layerManager.addLayersToMap(self.map);
      self.$layerManager.initToggledLayersFromUrl(self.map);
    });

    map.on("mousemove", () => {
      map.getCanvas().style.cursor = "crosshair";
    });

    map.on("mouseout", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", function (e) {
      self.addMarker(e);
      EventBus.$emit("clearAddress");
      self.$store.commit("setSelectedLngLat", [e.lngLat.lng, e.lngLat.lat]);
      EventBus.$emit("select-from-click", [e.lngLat.lng, e.lngLat.lat]);
    });

    EventBus.$on("add-marker", () => {
      const lngLat = self.$store.getters.getSelectedLngLat;
      if (isNaN(+lngLat[0]) || isNaN(+lngLat[1])) return;
      self.addMarker({
        lngLat: {
          lng: +lngLat[0],
          lat: +lngLat[1],
        },
      });
    });

    EventBus.$on("clear-selected", () => {
      if (self.marker) {
        self.marker.remove();
        self.marker = null;
      }
    });

    EventBus.$on("zoom-to", this.zoomTo);
  },
  methods: {
    zoomTo: function () {
      let self = this;
    },
    addMarker(e) {
      let self = this;
      if (self.marker) {
        self.marker.remove();
      }

      self.$querystringManager.addQueryParam(
        "selected",
        [e.lngLat.lng.toFixed(3), e.lngLat.lat.toFixed(3)].join(",")
      );

      self.marker = new mapboxgl.Marker({
        color: self.$styleConfig.styles["marker-color"],
        draggable: false,
      }).setLngLat(e.lngLat);

      self.marker.addTo(self.$map);
    },
  },
  computed: {},
  watch: {},
};
</script>
<style scoped>

#main-map {
  width: 100%;
  height: 100vh;
}
.mapboxgl-ctrl-bottom-right {
  pointer-events: auto;
}
</style>
<style>
.mapboxgl-ctrl-attrib-inner {
  display: inline-block;
}

.third-party-logo {
  max-height: 40px;
  max-width: 110px;
  padding: 0 5px;
}
.third-party-container {
  transform: translate(-100px, -15px);
}
</style>
