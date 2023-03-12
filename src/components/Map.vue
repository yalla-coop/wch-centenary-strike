<template>
  <div>
    <div
      id="main-map"
      :class="{ expanded: this.mapExpanded, 'mapboxgl-map': true }"
    >
    </div>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mainConfig from '../config/mainConfig.json'
import styleConfig from '../config/styleConfig.json'
import BasemapControl from "../js/BasemapControl";
import LegendControl from "../js/LegendControl";

import { EventBus } from "../js/DataManagement/EventBus";
import $ from "jquery";
export default {
  // eslint-disable-next-line
  name: "Map",
  components: {},
  props: {
    startLocation: {
      center: Array,
      zoom: Number
    }
  },
  data: function () {
    return {
      mapExpanded: false,
    };
  },
  mounted: function () {
    mapboxgl.accessToken = mainConfig.api.keys["mb-key"];
    this.map = new mapboxgl.Map({...mainConfig.mapConfig, ...this.startLocation});
    let map = (this.$.appContext.app.config.globalProperties.$map = this.map);
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
    this.map.addControl(new BasemapControl(this), "top-left");
    map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.once("idle", () => {
      $("body > #loading").fadeOut();
      self.initLayers();
    });

    map.on("moveend", () => {
      const url = new URL(location.href);
     // console.log(navigator.userAgent.includes('safari'));
      if (url.hash.includes("##") && !navigator.userAgent.includes('safari')) {
      //  const newHref = location.href.replace(/(?<=#).*?(?=&)/g, "");
       // window.history.replaceState({}, "", newHref.replace("##","#"));
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
        this.$router.replace({path: this.$route.path, query: {}, hash: location.hash})
        self.$layerManager.styleCircleSelection();
        EventBus.$emit("clear-event");
        return;
      }

      const eventFeatures = features
        .filter((f) => f.layer.id === "event-hit-layer")
        .map((f) => f.properties);

      EventBus.$emit("new-panel", eventFeatures); //HC

      //if (eventFeatures.length !== 1) {
      this.$store.commit(
        "setSelectedEventId",
        eventFeatures.length === 1 ? eventFeatures[0].name : -1
      );
      if (eventFeatures.length === 1) {
        this.$router.replace({path: this.$route.path, query: {event: eventFeatures[0].name}, hash: location.hash})
      } else{
        this.$router.replace({path: this.$route.path, query: {}, hash: location.hash})
      }
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
        filter: "filter__field_177157__contains=published", // TODO: Abstract filter options to object
        sizeLimit: 150,
        tableid: mainConfig.api.baserow.tables.main,
        style: styleConfig["baserow-markers"],
      });

      this.$layerManager.initToggledLayersFromUrl(this.map);
      let self = this;

      if (!this.legendControl) {
        this.legendControl = new LegendControl(this.$.appContext.app.config.globalProperties);
        self.map.addControl(this.legendControl, "bottom-left");
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
    },
  },
  watch: {},
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
