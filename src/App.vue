<template>
  <v-app id="app">
    <v-toolbar color="yellow">
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title>
        <h1 class="toolbar-title">WORKING CLASS HISTORY</h1>
        <nav id="site-navigation" class="main-navigation" role="navigation">
          <div class="menu-header-menu-wch-container">
            <ul id="top-menu" class="menu nav-menu" aria-expanded="false">
              <li
                id="menu-item-21"
                class="
                  menu-item
                  menu-item-type-post_type
                  menu-item-object-page menu-item-21
                "
              >
                <a href="https://workingclasshistory.com/about/">About</a>
              </li>
              <li
                id="menu-item-152"
                class="
                  menu-item
                  menu-item-type-post_type
                  menu-item-object-page menu-item-152
                "
              >
                <a href="https://workingclasshistory.com/podcast/">Podcast</a>
              </li>
              <li
                id="menu-item-149"
                class="
                  menu-item
                  menu-item-type-post_type
                  menu-item-object-page menu-item-149
                "
              >
                <a href="https://workingclasshistory.com/projects/">Projects</a>
              </li>
              <li
                id="menu-item-18"
                class="
                  menu-item
                  menu-item-type-post_type
                  menu-item-object-page menu-item-18
                "
              >
                <a href="https://workingclasshistory.com/support/"
                  >Support us</a
                >
              </li>
              <li
                id="menu-item-20"
                class="
                  menu-item
                  menu-item-type-post_type
                  menu-item-object-page menu-item-20
                "
              >
                <a href="https://workingclasshistory.com/sign-up/">Sign up</a>
              </li>
              <li
                id="menu-item-95"
                class="
                  menu-item
                  menu-item-type-custom
                  menu-item-object-custom
                  menu-item-95
                "
              >
                <a
                  target="_blank"
                  rel="noopener"
                  href="https://shop.workingclasshistory.com/"
                  >Shop</a
                >
              </li>
            </ul>
          </div>
        </nav>
      </v-toolbar-title>
    </v-toolbar>
    <v-container fluid class="pa-0 blue lighten-5">
      <v-row class="ma-0">
        <v-col cols="1" sm="12" class="pa-0">
          <Map />
        </v-col>
      </v-row>
    </v-container>
    <v-footer :padless="padless" color="yellow"
      ><nav
        class="jetpack-social-navigation jetpack-social-navigation-genericons"
        aria-label="Social Links Menu"
      >
        <div class="menu-social-menu-container">
          <ul id="menu-social-menu" class="menu">
            <li
              id="menu-item-35"
              class="
                menu-item
                menu-item-type-custom
                menu-item-object-custom
                menu-item-35
              "
            >
              <a
                rel="noopener"
                href="http://instagram.com/workingclasshistory"
                onclick="javascript:window.open('http://instagram.com/workingclasshistory'); return false;"
                ><v-icon class="screen-reader-text">mdi-instagram</v-icon></a
              >
            </li>
            <li
              id="menu-item-27"
              class="
                menu-item
                menu-item-type-custom
                menu-item-object-custom
                menu-item-27
              "
            >
              <a
                rel="noopener"
                href="https://www.facebook.com/workingclasshistory/"
                onclick="javascript:window.open('https://www.facebook.com/workingclasshistory/'); return false;"
                ><v-icon class="screen-reader-text">mdi-facebook</v-icon></a
              >
            </li>
            <li
              id="menu-item-26"
              class="
                menu-item
                menu-item-type-custom
                menu-item-object-custom
                menu-item-26
              "
            >
              <a
                rel="noopener"
                href="http://twitter.com/wrkclasshistory"
                onclick="javascript:window.open('http://twitter.com/wrkclasshistory'); return false;"
                ><v-icon class="screen-reader-text">mdi-twitter</v-icon></a
              >
            </li>
            <li
              id="menu-item-34"
              class="
                menu-item
                menu-item-type-custom
                menu-item-object-custom
                menu-item-34
              "
            >
              <a
                rel="noopener"
                href="https://open.spotify.com/show/3dqQUrBAmXgoU1Q6hcUnBX"
                onclick="javascript:window.open('https://open.spotify.com/show/3dqQUrBAmXgoU1Q6hcUnBX'); return false;"
                ><v-icon class="screen-reader-text">mdi-spotify</v-icon></a
              >
            </li>
            <li
              id="menu-item-49"
              class="
                menu-item
                menu-item-type-custom
                menu-item-object-custom
                menu-item-49
              "
            >
              <a
                rel="noopener"
                href="https://workingclasshistory.tumblr.com"
                onclick="javascript:window.open('https://workingclasshistory.tumblr.com/'); return false;"
                ><v-icon class="screen-reader-text">mdi-tumblr</v-icon></a
              >
            </li>
            <li
              id="menu-item-28"
              class="
                menu-item
                menu-item-type-custom
                menu-item-object-custom
                menu-item-28
              "
            >
              <a
                rel="noopener"
                href="https://www.youtube.com/c/workingclasshistory"
                onclick="javascript:window.open('https://www.youtube.com/c/workingclasshistory'); return false;"
                ><v-icon class="screen-reader-text">mdi-youtube</v-icon></a
              >
            </li>
            <li
              id="menu-item-54"
              class="
                menu-item
                menu-item-type-custom
                menu-item-object-custom
                menu-item-54
              "
            >
              <a
                rel="noopener"
                href="https://www.pinterest.com/workingclasshistory/"
                onclick="javascript:window.open('https://www.pinterest.com/workingclasshistory/'); return false;"
                ><v-icon class="screen-reader-text">mdi-pintrest</v-icon></a
              >
            </li>
            <li
              id="menu-item-1297"
              class="
                menu-item
                menu-item-type-custom
                menu-item-object-custom
                menu-item-1297
              "
            >
              <a
                href="https://mastodon.social/@workingclasshistory"
                onclick="javascript:window.open('https://mastodon.social/@workingclasshistory'); return false;"
                ><v-icon class="screen-reader-text">mdi-mastodon</v-icon></a
              >
            </li>
          </ul>
        </div>
      </nav></v-footer
    >
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

.main-navigation a{
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
