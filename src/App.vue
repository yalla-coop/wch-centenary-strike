<template>
  <v-app>
    <div id="loading" class="shown">
      <div style=" overflow: hidden; background-color: #000; color:white; font-family: 'Roboto', sans-serif !important; position: fixed; top: 0; bottom: 0; right: 0; left: 0;">
        <div style="position: fixed; top: 0; width: 100%; z-index: 9; color: white; margin: 20px 0;">
          Loading...
        </div>
        <img style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 25%;" src="assets/wch-centenary-strike-logo.webp" alt="">
      </div>
    </div>
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
        <path d="M1 5.5H21" :stroke="styleConfig().colors.purple.primary" stroke-linecap="round"></path>
        <path d="M1 10.5H21" :stroke="styleConfig().colors.yellow.primary" stroke-linecap="round"></path>
      </svg>
    </div>

    <SideNav />
    <v-container fluid class="pa-0 blue lighten-5">
      <v-row class="ma-0">
        <v-col cols="1" sm="12" class="pa-0">
          <Map :start-location="{center: this.startLocation.center, zoom: this.startLocation.zoom}" :showApp="showApp"/>
        </v-col>
      </v-row>
      <v-icon
        @click="toggleExpand()"
        color="white"
        size="x-large"
        :class="{ retract: true, 'panel-toggle': true, hidden: panelExpanded || this.$store.getters.getNavMenuExpanded}"
        >mdi-chevron-double-left</v-icon
      >
      <v-icon
        @click="toggleExpand()"
        color="white"
        size="x-large"
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
import styleConfig from './config/styleConfig.json';
import mainConfig from './config/mainConfig.json';
import LayerManager from "./js/LayerManager.js";
import { EventBus } from "./js/DataManagement/EventBus";
import $ from "jquery";
import { getAllTagsForCategory } from './js/baserow/api.js';

export default {
  name: "App",
  components: {
    
    // eslint-disable-next-line
    Map,
    InfoPanel,
    SideNav,
    MainFooter,
  },
  beforeCreate: function () {
    this.$.appContext.app.config.globalProperties.$layerManager = new LayerManager(this);

    //Initialize from defaults or url
    window.addEventListener(
      "resize",
      function () {
        //  self.$store.commit("setMobile");
      },
      true
    );
  },
  // Support and transform saved encoded hash urls
  created() {
    const params = new URLSearchParams(location.search);
    const day = params.get("day");
    const month = params.get("month");

    if(day && month){
      this.$store.commit("setDay", +day);
      this.$store.commit("setMonth", +month);
      this.$store.commit('setFiltersActive', true)

    }
    if( location.hash.includes("#%26map=") ) {
      let eventQuery = +location.search.split("?event=")[1]
      let mapHash = location.hash.split("#%26map=")[1]
      let locationParam = mapHash.split("/")
      this.startLocation = {
        center: [+locationParam[2], +locationParam[1]],
        zoom: [+locationParam[0]]
      }
      if (eventQuery) {
        this.$router.replace({path: this.$route.path, query: {event: eventQuery}})
      } else {
        this.$router.replace({path: this.$route.path})
      }
    }
  },
  data() {
    return {
      sideInstance: null,
      panelExpanded: true,
      menuOpen: false,
      startLocation: {
        center: mainConfig.mapConfig.center,
        zoom: mainConfig.mapConfig.zoom
      }
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
    styleConfig: function () {
      return styleConfig
    },
    showApp: function(){
      $("#loading").fadeOut()
    }
  },
  watch: {},
  mounted: function () {
    let self = this;
    this.panelExpanded = window.location === window.parent.location;

    const params = new URLSearchParams(location.search);
		const eId = params.get("event");

		if(eId){
			this.$store.commit("setSelectedEventId", +eId);
			EventBus.$emit('select-from-url', +eId)
		}

    EventBus.$emit("toggle-panel", this.panelExpanded);

    EventBus.$on("close-main-menu", () => {
      self.menuOpen = false;
    });

    EventBus.$on('events-load-enqueued', () => {
      ['people', 'organisations', 'topics', 'countries'].forEach(category => {
        getAllTagsForCategory(category, (tags) => {
          this.$store.commit("pushTagsToCategory", { category, tags })
        })
      })
    })

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
      this.$route.query.selected || ""
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
<style lang="scss">
* {
  font-family: 'Roboto', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}
.portrait {

  #main-map {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .side-nav-container {
    max-width: 100%;
    width: 100%;
    pointer-events: none;
    aside {
      max-width: 100%;
      width: 100% !important;
    }
  }
  #info-panel {
    width: 85%;
    z-index: 3;
  }
  .ant-layout-sider-children {
    padding: 10% 0 0;
    text-align: left;
    margin-left: 10%;
    font-size: 1.25em;
    a {
      color: white;
      display: block;
      margin: 8px 0;
      min-width: max-content;
    }
  }
  .v-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .wch-menu-logo.upper {
    display: none;
  }
  a.wch-menu-logo.outer.lower {
    display: inline-block;
  }
  .open-menu {
    display: inline-block;
    position: absolute;
    z-index: 9;
    margin: 4%;
  }
  .nav-drawer {
    &::before {
      content: "";
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      height: 4px;
      background: rgb(250, 212, 10);
    }
  }
  .menu-mobile-close-btn {
    display: inline-block;
    cursor: pointer;
    margin-bottom: 25px;
    top: 25px;
  }
  a.wch-menu-logo.upper {
    display: none;
  }
}

a.wch-menu-logo.outer.lower {
  display: none;
  position: absolute;
  bottom: 5%;
  right: 5%;
}
.open-menu {
  display: none;
}
.menu-mobile-close-btn {
  display: none;
}
a.wch-menu-logo.outer.upper {
  display: none;
}
.embed {

  #searchControl,
  .side-nav-container,
  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-top-left,
  .mapboxgl-ctrl-top-right,
  .v-footer,
  .legend-title,
  .legend-list {
    display: none;
  }
  .container {
    height: 100%;
    overflow-x: hidden;
  }
  #info-panel {
    height: 100%;
    overflow-x: hidden;
  }
  #main-map {
    height: 100vh;
  }
  .list-item {
    padding: 0px;
    margin-bottom: 0px;
  }
  .legend-container {
    .v-card__text {
      padding: 10px;
    }
  }
  .portrait {
    .open-menu {
      display: none;
    }
  }
}
.mobile-embed {

  #searchControl,
  .side-nav-container,
  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-top-left,
  .mapboxgl-ctrl-top-right,
  .v-footer,
  .legend-title,
  .open-menu,
  .legend-list {
    display: none;
  }
  footer {
    display: none;
  }
  #info-panel {
    height: 100%;
    overflow-x: hidden;
  }
  .legend-list {
    .list-item {
      margin: 0;
      line-height: .67em;
    }
  }
  .legend-container {
    .v-card__text {
      padding-bottom: 5px;
      padding-top: 5px;
    }
  }
}

</style>
<style lang="scss" scoped>
.panel-toggle {
  position: absolute;
  bottom: 240px;
  right: 25%;
  padding: 8px;
  height: auto;
  width: auto;
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
.portrait {
  .panel-toggle {
    right: 85%;
    z-index: 3;
    bottom: 50%;
  }
  .panel-toggle.retract {
    right: 0;
  }
}

</style>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
#loading {
  margin: 10% auto;
  text-align: center;
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  opacity: 1;
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
  font-family: "Cooper Hewitt Medium", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
}
.menu-social-menu {
  list-style: square;
  display: inline-block;
}
.main-navigation {
  list-style: square;
  display: inline-block;
  a {
    color: #505050 !important;
  }
  li {
    display: inline-block;
    margin: 0;
    margin-left: 0px;
    line-height: 1;
    a {
      text-decoration: none;
      margin: 0 5px;
    }
  }
}
.jetpack-social-navigation {
  li {
    display: inline-block;
    margin: 0;
    margin-left: 0px;
    line-height: 1;
    a {
      text-decoration: none;
      margin: 0 5px;
    }
  }
}
.mapboxgl-popup-close-button {
  font-size: 32px;
}
/* FINAL MOBILE LEGEND FIX - Replace the debug CSS with this */
@media (max-width: 768px) {
  /* Override the display:none rules */
  .mobile-embed .mapboxgl-ctrl-bottom-left,
  .mobile-embed .legend-title,
  .mobile-embed .legend-list {
    display: block !important;
  }
  
  /* Fix the positioning so the legend doesn't get cut off */
  .mapboxgl-ctrl-bottom-left {
    bottom: 40px !important; /* Move it up above the footer */
    max-height: none !important;
    height: auto !important;
  }
  
  
}
</style>
