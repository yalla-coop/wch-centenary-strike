<template>
  <v-app id="app">
    <!-- <MainTopBar /> -->
    <SideNav />
    <v-container fluid class="pa-0 blue lighten-5">
      <v-row class="ma-0">
        <v-col cols="1" sm="12" class="pa-0">
          <Map />
        </v-col>
      </v-row>
      <v-icon
        @click="toggleExpand()"
        :class="{ retract: true, 'panel-toggle': true, hidden: panelExpanded }"
        >mdi-chevron-double-left</v-icon
      >
      <v-icon
        @click="toggleExpand()"
        :class="{ expand: true, 'panel-toggle': true, hidden: !panelExpanded }"
        >mdi-chevron-double-right</v-icon
      >
      <InfoPanel v-show="panelExpanded" ref="infoPanel" />
    </v-container>
    <MainFooter />
  </v-app>
</template>

<script>
import Map from "./components/Map.vue";
import InfoPanel from "./components/InfoPanel.vue";
import MainFooter from "./components/MainFooter.vue";
import SideNav from "./components/SideNav.vue";
//import MainTopBar from "./components/MainTopBar.vue";
import Vue from "vue";

import { EventBus } from "./js/DataManagement/EventBus";

import DataManager from "./js/DataManagement/DataManager.js";
import QuerystringManager from "./js/DataManagement/QuerystringManager";
import LayerManager from "./js/LayerManager.js";

import Store from "./js/DataManagement/Store.js";

export default {
  name: "App",
  components: {
    Map,
    InfoPanel,
    SideNav,
    //MainTopBar,
    MainFooter,
  },
  beforeCreate: function () {
    Vue.prototype.$dataManager = new DataManager();
    Vue.prototype.$layerManager = new LayerManager();
    Vue.prototype.$querystringManager = new QuerystringManager();

    //Initialize from defaults or url
    window.addEventListener(
      "resize",
      function () {
        //  self.$store.commit("setMobile");
      },
      true
    );
  },
  data() {
    return {
      sideInstance: null,
      panelExpanded: true,
    };
  },
  methods: {
    toggleExpand() {
      this.panelExpanded = !this.panelExpanded;
      EventBus.$emit("toggle-panel", this.panelExpanded);
    },
  },
  watch: {},
  mounted: function () {
    if (
      window.location !== window.parent.location &&
      this.$store.getters.isMobile
    ) {
      document.querySelector("html").classList.add("in-iframe");
    }
    const selectedLngLat = (
      this.$querystringManager.route.query.selected || ""
    ).split(",");

    if (selectedLngLat.length > 0) {
      let self = this;

      self.$store.commit(
        "setSelectedLngLat",
        selectedLngLat.map((l) => +l)
      );
      this.$map.once("idle", () => {
        EventBus.$emit(
          "select-district-from-url",
          selectedLngLat.map((l) => +l)
        );
      });
    }
    let self = this;
    EventBus.$on("new-panel", (dat) => {
      self.$refs.infoPanel.setData(dat);
    });

    if (
      this.$store.getters.isMobile &&
      window.innerHeight > window.innerWidth
    ) {
      document.querySelector("html").classList.add("in-iframe");
      this.dialog = true;
    }
  },
};
</script>
<style scoped>
.panel-toggle {
  position: absolute;
  bottom: 240px;
  right: 25%;
  background: #ffffffed;
  padding: 8px;
  font-size: 30px;
  cursor: pointer;
  display: block;
}

.hidden {
  display: none !important;
}

.retract {
  right: 0;
}
</style>
<style>


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  overflow: hidden;
}
:root {
  --charcoal: #264653ff;
  --persian-green: #2a9d8fff;
  --orange-yellow-crayola: #e9c46aff;
  --sandy-brown: #f4a261ff;
  --burnt-sienna: #e76f51ff;

  --cg-blue: #0081a7ff;
  --verdigris: #00afb9ff;
  --light-yellow: #fdfcdcff;
  --peach-puff: #fed9b7ff;
  --light-peach-puff: #fff4e9;
  --tan: #eebe8f;
  --bittersweet: #f07167ff;

  --imperial-red: #ec0021;
  --honeydew: rgb(232, 242, 255);
  --powder-blue: rgb(192, 215, 228);
  --celadon-blue: rgb(146, 188, 214);
  --prussian-blue: #1d3557ff;
}

html {
  overflow-y: hidden;
}

html.in-iframe {
  overflow-y: scroll;
}

.rotate-mobile {
  transform: rotate(90deg);
}

.extra-zoom {
  zoom: 0.75;
}

.toolbar-title {
  font-family: "Cooper Hewitt Medium", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
}

.menu-social-menu,
.main-navigation {
  list-style: square;
  display: inline-block;
}

.main-navigation a {
  color: #505050 !important;
}

.main-navigation li,
.jetpack-social-navigation li {
  display: inline-block;
  margin: 0;
  margin-left: 0px;
  line-height: 1;
}

.main-navigation li a,
.jetpack-social-navigation li a {
  text-decoration: none;
  margin: 0 5px;
}

.mapboxgl-popup-close-button {
  font-size: 32px;
}
</style>
