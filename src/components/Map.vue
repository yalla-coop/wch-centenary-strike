<template>
  <div>
    <div
      id="main-map"
      :class="{ expanded: this.mapExpanded, 'mapboxgl-map': true }"
    >
      <!-- <div class="mapboxgl-ctrl-bottom-right third-party-container">
        <a
          v-for="logo in $mainConfig['map-logos']"
          :key="logo.link"
          :href="logo.link"
          target="_blank"
        >
          <img class="third-party-logo" :src="logo['img-src']" />
        </a>
      </div> -->
    </div>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";

import BasemapControl from "../js/BasemapControl";
import LegendControl from "../js/LegendControl";

import Vue from "vue";
import { EventBus } from "../js/DataManagement/EventBus";
import EventManager from "../js/DataManagement/EventMangager";

import $ from "jquery";
export default {
  name: "Map",
  components: {},
  data: function () {
    return {
      mapExpanded: false,
    };
  },
  mounted: function () {
    mapboxgl.accessToken = this.$mainConfig.api.keys["mb-key"];
    this.map = new mapboxgl.Map(this.$mainConfig.mapConfig);
    let map = (Vue.prototype.$map = this.map);
    Vue.prototype.$eventManager = new EventManager();
    let self = this;
    EventBus.$on("toggle-panel", (panelExpanded) => {
      self.mapExpanded = !panelExpanded;
      self.$nextTick(() => {
        self.map.resize();
      });
    });

    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      placeholder: "Search for address", // Placeholder text for the search bar
    });

    map.addControl(geocoder);
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );
    this.map.addControl(new BasemapControl(), "top-left");
    map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.once("idle", () => {
      $("body > #loading").fadeOut();
      self.initLayers();
    });

    map.on("moveend", () => {
      const url = new URL(location.href);
      //console.log(url);
      if (url.hash.includes("##")) {
        const newHref = location.href.replace(/(?<=#).*?(?=&)/g, "");
        window.history.replaceState({}, "", newHref.replace("##","#"));
        
      }
    });

    map.on("mousemove", () => {
      map.getCanvas().style.cursor = "crosshair";
    });

    map.on("mouseout", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point);
      if (features.length === 0) {
        self.$store.commit("setSelectedEventId", -1);
        self.$layerManager.styleCircleSelection();
        EventBus.$emit("clear-event");
        return;
      }

      const eventFeatures = features
        .filter((f) => f.layer.source === "events-source")
        .map((f) => f.properties);

      EventBus.$emit("new-panel", eventFeatures); //HC

      //if (eventFeatures.length !== 1) {
      this.$store.commit(
        "setSelectedEventId",
        eventFeatures.length === 1 ? eventFeatures[0].name : -1
      );
      // }
      self.$nextTick(() => {
        self.$layerManager.styleCircleSelection();
      });
    });

    EventBus.$on("clear-selected", () => {
      if (self.marker) {
        self.marker.remove();
        self.marker = null;
      }
    });
    EventBus.$on("switch-base", this.initLayers);
    EventBus.$on("zoom-to", this.zoomTo);
  },
  methods: {
    initLayers() {
      //HC
      this.$layerManager.addLayerToMap({
        type: "baserow",
        map: this.map,
        filter: "filter__field_177149__not_empty", //FILTER NOT WORKING. REMOVING THESE IN CODE
        //numPages: this.$mainConfig.api.baserow.tables["num-pages"],//Don't need this anymore
        sizeLimit: 100,
        tableid: this.$mainConfig.api.baserow.tables.main,
        style: this.$styleConfig["baserow-markers"],
      });

      this.$layerManager.initToggledLayersFromUrl(this.map);
      let self = this;
      if (!this.legendControl) {
        this.legendControl = new LegendControl();
        //this.map.once("styledata", () => {
        self.map.addControl(new LegendControl(), "bottom-left");
        //});
      }
    },
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

      // self.marker = new mapboxgl.Marker({
      //   color: self.$styleConfig.styles["marker-color"],
      //   draggable: false,
      // }).setLngLat(e.lngLat);

      // self.marker.addTo(self.$map);
    },
  },
  watch: {
    // toggledLayer: function (val) {
    //   if (this.legendLayers.length > 0) {
    //     // if(val){
    //     // }
    //     console.log(this.legendLayers[val]["layer-id"]);
    //   }
    // },
  },
};
</script>
<style scoped>
#main-map {
  height: calc(100vh - 37px);
}

#main-map {
  width: 75%;
}

#main-map.expanded {
  width: 100%;
  right: 0px;
}

.expanded .mapboxgl-canvas-container {
  width: 100% !important;
  right: 0 !important;
}
.mapboxgl-ctrl-bottom-right {
  pointer-events: auto;
}

/* raven
exl and touring */
</style>
<style>
.mapboxgl-ctrl-top-left {
  top: 0;
  left: 155px;
}
.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl {
  margin: 0;
  width: 160px;
}
.mapboxgl-popup-content {
  overflow-y: scroll;
  max-height: 35vh;
  /* font-family: "Avenir Heavy"; */
  font-size: 12px;
  width: 125%;
}

.mapboxgl-popup-content .hidden {
  display: none;
}
.mapboxgl-popup-content .img-caption {
  font-style: italic;
}
.img-container {
  width: 100%;
}

.img-container img {
  max-width: 90%;
  margin: 0 auto;
  display: block;
}

.mapboxgl-popup-content .popup-title {
  border-bottom: 1px solid black;
  padding-bottom: 8px;
  margin-bottom: 8px;
  font-weight: bold;
}
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

.basemap-control-container {
  color: white;
  padding: 5px;
  background: black;
}

.basemap-control-container ul {
  list-style: none;
}

.mapboxgl-ctrl-bottom-left {
  z-index: 3;
}

.mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-attrib-inner a {
  color: #565656;
}

.portrait .mapboxgl-ctrl-bottom-left {
  z-index: 2;
}
.portrait .mapboxgl-ctrl-top-left,
.portrait .mapboxgl-ctrl-bottom-right,
.portrait .mapboxgl-ctrl-top-right .mapboxgl-ctrl-geocoder {
  display: none;
}
</style>
