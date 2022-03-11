<template>
  <v-app id="app">
    <v-toolbar color="yellow">
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title > <h1 class="toolbar-title">WORKING CLASS HISTORY</h1> </v-toolbar-title>
    </v-toolbar>
    <v-container fluid class="pa-0 blue lighten-5">
      <v-row class="ma-0">
        <v-col cols="1" sm="12" class="pa-0">
          <Map />
        </v-col>
      </v-row>
    </v-container>
      <v-footer
      :padless="padless"
      color="yellow"
    >Footer</v-footer>
  </v-app>
</template>

<script>
import Map from "./components/Map.vue";
import Vue from "vue";

import { EventBus } from "./js/DataManagement/EventBus";

import DataManager from "./js/DataManagement/DataManager.js";
import QuerystringManager from "./js/DataManagement/QuerystringManager";
import LayerManager from "./js/LayerManager.js";

export default {
  name: "App",
  components: {
    Map,
  },
  beforeCreate: function () {
    Vue.prototype.$dataManager = new DataManager();
    Vue.prototype.$layerManager = new LayerManager();
    Vue.prototype.$querystringManager = new QuerystringManager();

    //Initialize from defaults or url
    window.addEventListener(
      "resize",
      function () {
        self.$store.commit("setMobile");
      },
      true
    );
  },
  data() {
    return {};
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

.toolbar-title{
      font-family: "Cooper Hewitt Medium", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: bold;
    text-transform: uppercase;
}


</style>
