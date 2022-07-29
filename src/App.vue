<template>
  <v-app id="app">
    <!-- <MainTopBar /> -->
    <div
      class="open-menu"
      v-show="!menuOpen"
      @click="openMenu()"
      style="cursor: pointer"
    >
      <svg
        width="22"
        height="11"
        viewBox="0 0 22 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        icon="burger"
        style="cursor: pointer"
      >
        <path d="M1 0.5H21" stroke="white" stroke-linecap="round"></path>
        <path d="M1 5.5H21" :stroke="this.$styleConfig.colors.purple.primary" stroke-linecap="round"></path>
        <path d="M1 10.5H21" :stroke="this.$styleConfig.colors.yellow.primary" stroke-linecap="round"></path>
      </svg>
    </div>
    <SideNav />
    <v-container fluid class="pa-0 blue lighten-5">
      <v-row class="ma-0">
        <v-col cols="1" sm="12" class="pa-0">
          <Map />
        </v-col>
      </v-row>
      <v-icon
        @click="toggleExpand()"
        dark
        :class="{ retract: true, 'panel-toggle': true, hidden: panelExpanded || this.$store.getters.getNavMenuExpanded}"
        >mdi-chevron-double-left</v-icon
      >
      <v-icon
        @click="toggleExpand()"
        dark
        :class="{ expand: true, 'panel-toggle': true, hidden: !panelExpanded || this.$store.getters.getNavMenuExpanded}"
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
      menuOpen: false,
    };
  },
  methods: {
    toggleExpand() {
      this.panelExpanded = !this.panelExpanded;
      this.$store.commit('setInfoPanelExpanded', this.panelExpanded);
      EventBus.$emit("toggle-panel", this.panelExpanded);
    },
    openMenu() {
      this.menuOpen = true;
      this.$store.commit('setNavMenuExpanded', true);
      EventBus.$emit("open-main-menu");
    },
  },
  watch: {},
  mounted: function () {
    let self = this;
    this.panelExpanded = window.location === window.parent.location;

    const params = new URLSearchParams(location.search);
		const eId = params.get("event");
		if(eId){
			this.$store.commit("setSelectedEventId", +eId);
		}

    EventBus.$emit("toggle-panel", this.panelExpanded);

    EventBus.$on("close-main-menu", () => {
      self.menuOpen = false;
    });

    EventBus.$on("force-info-open", () => {
      if (this.panelExpanded) return;
      this.panelExpanded = true;
       this.$store.commit("setInfoPanelExpanded", true);
      EventBus.$emit("toggle-panel", this.panelExpanded);
    });

    EventBus.$on("force-info-close", () => {
      if (!this.panelExpanded) return;
      this.panelExpanded = false;
      this.$store.commit("setInfoPanelExpanded", false);
      EventBus.$emit("toggle-panel", this.panelExpanded);
    });

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
    // let self = this;
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
<style>
*{
  font-family: 'Roboto', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}
.portrait #main-map {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
.portrait .side-nav-container {
  max-width: 100%;
  width: 100%;
  pointer-events: none;
}

.portrait #info-panel {
  width: 85%;
  z-index: 3;
}

.portrait .side-nav-container aside {
  max-width: 100%;
  width: 100% !important;
}

.portrait .ant-layout-sider-children {
  padding: 10% 0 0;
  text-align: left;
  margin-left: 10%;
  font-size: 1.25em;
}
.portrait .ant-layout-sider-children a {
  color: white;
  display: block;
  margin: 8px 0;
  min-width: max-content;
}
.portrait .v-footer {
  position: absolute;
  bottom: 0;
  width: 100%;

}


a.wch-menu-logo.outer.lower,
.portrait .wch-menu-logo.upper,
.open-menu,
.menu-mobile-close-btn {
  display: none;
}

.portrait a.wch-menu-logo.outer.lower{
  display: inline-block;
}

.portrait .open-menu {
  display: inline-block;
  position: absolute;
  z-index: 9;
  /* font-size: 2em; */
  margin: 4%;
}

.portrait .nav-drawer::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 4px;
  background: rgb(250, 212, 10);
}
.portrait .menu-mobile-close-btn {
  display: inline-block;
  cursor: pointer;
  margin-bottom: 25px;
  top: 25px;
}
.portrait a.wch-menu-logo.upper,
a.wch-menu-logo.outer.upper {
  display: none;
}

a.wch-menu-logo.outer.lower {
  position: absolute;
  bottom: 5%;
  right: 5%;
}
.embed .side-nav-container,
.embed .info-book,
.embed .info-podcast,
.embed .info-merch,
.embed .info-author,
.embed .info-photo,
.embed .info-description,
.embed .info-title,
.embed .mapboxgl-ctrl-top-left,
.embed .mapboxgl-ctrl-top-right,
.embed .v-footer,
.embed .legend-title,
.embed .legend-list{
  display: none;
}

.embed .container,
.embed #info-panel {
  height: 100%;
  overflow-x: hidden;
}

.embed #main-map {
  height: 100vh;
}

.embed .list-item {
  padding: 0px;
  margin-bottom: 0px;
}

.embed .legend-container .v-card__text {
  padding: 10px;
}
</style>
<style scoped>
.panel-toggle {
  position: absolute;
  bottom: 240px;
  right: 25%;
  padding: 8px;
  font-size: 30px;
  cursor: pointer;
  display: block;
  background: #0008;
  border: 1px 1px 1px 0 solid;
  border-left: 1px solid #ffffff45;
  border-top: 1px solid #ffffff45;
  border-bottom: 1px solid #ffffff45;
}

.hidden {
  display: none !important;
}

.retract {
  right: 0;
}

.portrait .panel-toggle {
  right: 85%;
    z-index: 3;
  bottom: 50%;
}

.portrait .panel-toggle.retract {
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
