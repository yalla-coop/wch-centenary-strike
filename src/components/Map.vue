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
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mainConfig from '../config/mainConfig.json'
import styleConfig from '../config/styleConfig.json'
import BasemapControl from "../js/BasemapControl";
import LegendControl from "../js/LegendControl";
import { EventBus } from "../js/DataManagement/EventBus";

export default {
  // eslint-disable-next-line
  name: "Map",
  components: {},
  props: {
    startLocation: {
      center: Array,
      zoom: Number
    },
    showApp: { type: Function }
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

    this.map.addControl(new BasemapControl(this), "top-left");
    map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.once("idle", () => {
      this.showApp()
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
      const features = map.queryRenderedFeatures(e.point, {
        filter: map.getFilter('events-circles')
      });

      if (features.length === 0) {
        self.$store.commit("setSelectedEventId", -1);
        this.$router.replace({path: this.$route.path, query: {}, hash: location.hash})
        if(map.getFilter('events-circles')) {
          self.$layerManager.styleCircleSelection(map.getFilter('events-circles')[2][1])
        } else {
          self.$layerManager.clearCircleFeatureStyling();
        }

        EventBus.$emit("clear-event");
        return;
      }

      const eventFeatures = features
        .filter((f) => f.layer.id === "event-hit-layer")
        .map((f) => f.properties);

      EventBus.$emit("new-panel", eventFeatures); //HC

      this.$store.commit(
        "setSelectedEventId",
        eventFeatures.length === 1 ? eventFeatures[0].id : -1
      );
      if (eventFeatures.length === 1) {
        this.$router.replace({path: this.$route.path, query: {event: eventFeatures[0].id}, hash: location.hash})
        if(!map.getFilter('events-circles')) {
          self.$nextTick(() => {
              self.$layerManager.styleCircleSelection([this.$store.getters.getSelectedEventId]);
          });
        }
      } else{
        this.$router.replace({path: this.$route.path, query: {}, hash: location.hash})
          self.$nextTick(() => {
            if(map.getFilter('events-circles')) {
              self.$layerManager.styleCircleSelection(map.getFilter('events-circles')[2][1])
            } else {
              self.$layerManager.clearCircleFeatureStyling();
            }
          });
      }
    });

    EventBus.$on("clear-selected", () => {
      if (self.marker) {
        self.marker.remove();
        self.marker = null;
      }
    });
    EventBus.$on("switch-base", () => {
      // Set timeout due to known mapbox issue where style load event not reliable
      // https://github.com/mapbox/mapbox-gl-js/issues/8691
      setTimeout( () => {
        this.initLayers(true)
        if(this.$store.getters.getSelectedEventId > 0){
          this.$layerManager.styleCircleSelection([this.$store.getters.getSelectedEventId]);
        }
      }, 1000);
    });
    EventBus.$on("zoom-to", this.zoomTo);
  },
  methods: {
    initLayers(reinitialize = false) {
      //HC
      this.$layerManager.addLayerToMap({
        type: "baserow",
        map: this.map,
        sizeLimit: 150,
        style: styleConfig["baserow-markers"],
        reinitialize: reinitialize
      });

      this.$layerManager.initToggledLayers(this.map);
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
<style lang="scss" scoped>
#main-map {
  height: calc(100vh - 37px);
  width: 75%;
}
#main-map.expanded {
  width: 100%;
  right: 0px;
}
.expanded {
  .mapboxgl-canvas-container {
    width: 100% !important;
    right: 0 !important;
  }
}
.mapboxgl-ctrl-bottom-right {
  pointer-events: auto;
}

/* raven
exl and touring */
</style>
<style lang="scss">
.mapboxgl-ctrl-top-left {
  top: 0;
  left: 155px;
}
.mapboxgl-ctrl-bottom-left {
  .mapboxgl-ctrl {
    margin: 0;
    width: 160px;
  }
  z-index: 3;
}
.mapboxgl-popup-content {
  overflow-y: scroll;
  max-height: 35vh;
  font-size: 12px;
  width: 125%;
  .hidden {
    display: none;
  }
  .img-caption {
    font-style: italic;
  }
  .popup-title {
    border-bottom: 1px solid black;
    padding-bottom: 8px;
    margin-bottom: 8px;
    font-weight: bold;
  }
}
.img-container {
  width: 100%;
  img {
    max-width: 90%;
    margin: 0 auto;
    display: block;
  }
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
  ul {
    list-style: none;
  }
}
.mapboxgl-ctrl-bottom-right {
  .mapboxgl-ctrl-attrib-inner {
    a {
      color: #565656;
    }
  }
}
.portrait {
  .mapboxgl-ctrl-bottom-left {
    z-index: 2;
  }
  .mapboxgl-ctrl-top-left {
    display: none;
  }
  .mapboxgl-ctrl-bottom-right {
    display: none;
  }
  .mapboxgl-ctrl-top-right {
    .mapboxgl-ctrl-geocoder {
      display: none;
    }
  }
}
</style>
