<template>
  <div>
    <Legend/>
    <div id="main-map" :class="{'expanded':this.mapExpanded, 'mapboxgl-map':true}">
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

import Legend from './Legend.vue';

import Vue from "vue";
import { EventBus } from "../js/DataManagement/EventBus";
import EventManager from "../js/DataManagement/EventMangager";
export default {
  name: "Map",
  components:{
    Legend
  },
  data: function () {
    return {
      mapExpanded: false
    };
  },
  mounted: function () {
    mapboxgl.accessToken = this.$mainConfig.api.keys["mb-key"];
    this.map = new mapboxgl.Map(this.$mainConfig.mapConfig);
    let map = (Vue.prototype.$map = this.map);
    Vue.prototype.$eventManager = new EventManager();
    let self = this;
    EventBus.$on('toggle-panel',(panelExpanded)=>{
      self.mapExpanded = !panelExpanded;
      self.$nextTick(()=>{
       
        self.map.resize();
      })
    });



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

      //HC
      self.$layerManager.addLayerToMap({
        type: "baserow",
        map: self.map,
        //filter: "filter__field_177149__not_empty",
        numPages: self.$mainConfig.api.baserow.tables["num-pages"],
        sizeLimit: 100,
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

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point);
      if (features.length === 0) return;
      EventBus.$emit('new-panel', features.filter(f=>f.layer.source === 'events-source').map(f=>f.properties)); //HC
      
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
  height: calc(100vh - 100px);
}

#main-map {
  left: 25%;
  width: 75%;
}

#main-map.expanded{
  width:100%;
  left: 0px;
}

.expanded .mapboxgl-canvas-container {
  width:100% !important;
  right:0 !important;
}
.mapboxgl-ctrl-bottom-right {
  pointer-events: auto;
}

/* raven
exl and touring */

</style>
<style>

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


</style>
