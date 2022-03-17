<template>
  <div>
    <v-card dense elevation="2" class="legend-container">
      <v-card-title dense>Legend</v-card-title>
      <v-divider></v-divider>
      <ul class="legend-list">
        <li class="list-item" v-for="item in this.$mainConfig['legend-items']" :key="item.display"><span class="legend-item" :style="item.css"></span>{{item.text}}</li>
      </ul>
      <v-divider></v-divider>

      <v-card-text>
        <v-chip-group
          v-model="toggledLayer"
          active-class="blue accent-4 white--text"
          column
        >
          <v-chip
            filter
            v-for="layer in legendLayers"
            :click="toggleLayer(layer)"
            :key="layer['layer-id']"
          >
            {{ layer["legend-display"] }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>
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
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import Vue from "vue";
import { EventBus } from "../js/DataManagement/EventBus";
import EventManager from "../js/DataManagement/EventMangager";
export default {
  name: "Map",
  data: function () {
    return {
      toggledLayer: "",
    };
  },
  mounted: function () {
    mapboxgl.accessToken = this.$mainConfig.api.keys["mb-key"];
    this.map = new mapboxgl.Map(this.$mainConfig.mapConfig);
    let map = (Vue.prototype.$map = this.map);
    Vue.prototype.$eventManager = new EventManager();

    let self = this;

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      placeholder: "Search for address", // Placeholder text for the search bar
    });

    map.addControl(geocoder);
    map.addControl(new mapboxgl.ScaleControl(), "bottom-left");
    map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
    
    map.once("idle", () => {
      // self.$layerManager.addLayersToMap({
      //   map: self.map,
      //   url: self.$mainConfig.[NATIVE LAND URL],
      //   style: self.$styleConfig.[NATIVE LAND STYLE],
      // });
      self.$layerManager.addLayerToMap({
        type: "baserow",
        map: self.map,
        filter: "filter__field_177149__not_empty",
        sizeLimit: 200,
        tableid: self.$mainConfig.api.baserow.tables.main,
        style: self.$styleConfig["baserow-markers"],
      });

      self.$layerManager.initToggledLayersFromUrl(self.map);
    });

    map.on("mousemove", () => {
      map.getCanvas().style.cursor = "crosshair";
    });

    map.on("mouseout", () => {
      map.getCanvas().style.cursor = "";
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

      // self.marker = new mapboxgl.Marker({
      //   color: self.$styleConfig.styles["marker-color"],
      //   draggable: false,
      // }).setLngLat(e.lngLat);

      // self.marker.addTo(self.$map);
    },
    toggleLayer: function (_layer) {
      if (_layer) {
        this.$layerManager.toggleLayer(_layer["layer-id"]);
        if (_layer.labels) {
          this.$layerManager.toggleLayer(_layer["layer-id"] + "-labels");
        }
      }
    },
  },
  computed: {
    legendLayers: function () {
      return this.$mainConfig["toggleable-layers"];
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
.legend-list{
  list-style: none;
      padding: 0 5px;
}
#main-map {
  width: 100%;
  height: calc(100vh - 100px);
}
.mapboxgl-ctrl-bottom-right {
  pointer-events: auto;
}

.legend-container .v-card__title{
    background: yellow;
    padding: 0 5%;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 5px;
}
</style>
<style>
.legend-item{
  display: inline-block;
    margin: 0 5px;
}
.list-item{
  padding: 5px;
    background: #d7d7d7;
    margin-bottom: 5px;
}
.mapboxgl-popup-content {
  overflow-y: scroll;
  max-height: 35vh;
  /* font-family: "Avenir Heavy"; */
  font-size: 12px;
      width: 125%;
}

.mapboxgl-popup-content .hidden{
  display: none;
}
.mapboxgl-popup-content .img-caption{
  font-style:italic;
}
.img-container{
  width: 100%;
}

.img-container img{
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

.legend-container {
  position: absolute !important;
  /* width: 8%; */
  /* margin: 10px; */
  z-index: 9;
  right: 10px;
  bottom: 90px;
}
</style>
