<template>
  <v-footer color=" #020202">
    <nav
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
              href="https://www.instagram.com/generalstrike100"
              onclick="javascript:window.open('https://www.instagram.com/generalstrike100'); return false;"
              ><v-icon dark color="white" class="icon-class" size="24">mdi-instagram</v-icon></a
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
              href="https://www.facebook.com/profile.php?id=61579978164935"
              onclick="javascript:window.open('https://www.facebook.com/profile.php?id=61579978164935'); return false;"
              ><v-icon dark color="white" class="icon-class" size="24">mdi-facebook</v-icon></a
            >
          </li>
        </ul>
      </div>
    </nav>
    
    <!-- Information Pop-up -->
    <div id="aboutIcon" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1297">
      <v-menu
        v-model="infoDialog"
        :close-on-content-click="false"
        location="top"
        offset="8"
        max-width="350px"
      >
        <template v-slot:activator="{ props }">
          <v-icon icon="mdi-information-slab-circle-outline" v-bind="props"></v-icon>
        </template>
        <v-card color="#020202" class="info-popup-card">
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between align-start mb-2">
              <p class="mb-0 text-white flex-grow-1">
                Map by 
              <a href="https://workingclasshistory.com" target="_blank" onclick="javascript:window.open('https://workingclasshistory.com'); return false;">
                  Working Class History
                </a>
                and
               
                   <a href="https://yalla.coop" target="_blank" onclick="javascript:window.open('https://yalla.coop'); return false;">
                  Yalla
                </a>
              </p>
              <v-btn 
                icon 
                size="x-small" 
                variant="text" 
                color="white"
                class="ml-2 mt-n1"
                @click="infoDialog = false"
              >
                <v-icon size="14">mdi-close</v-icon>
              </v-btn>
            </div>
            <p class="mb-0 text-white text-caption">
              with
              <a href="https://github.com/Willjfield"
                 onclick="javascript:window.open('https://github.com/Willjfield'); return false;"
              >will field <v-icon small class="icon-class">mdi-github</v-icon></a>
              and
              <a href="https://github.com/todtb"
                 onclick="javascript:window.open('https://github.com/todtb'); return false;"
              >brian todt <v-icon small class="icon-class">mdi-github</v-icon></a>
            </p>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>

    <!-- Hidden AboutMap component for Learn More link -->
    <div style="display: none;">
      <AboutMap ref="aboutMap" />
    </div>
  </v-footer>
</template>

<script>
import AboutMap from './AboutMap.vue';
import {getOrientation} from '../js/helpers/orientationHelpers.js';

export default {
  name: "MainFooter",
  components: { AboutMap },
  data() {
    return {
      infoDialog: false
    }
  },
  methods: {
    // Method to open the full AboutMap dialog from Learn More link
    openAboutMap() {
      this.$refs.aboutMap.aboutMapExpanded = true;
    },
    getOrientation
  },
  mounted() {
    // Make the openAboutMap method available globally for the Learn More link
    window.openAboutMap = this.openAboutMap;
  }
};
</script>

<style lang="scss">
.v-footer {
  z-index: 9;
  background-color: #DF6E4B; 
  border-color: #DF6E4B;
}

#aboutIcon {
  color: white;
  text-decoration: none;
  padding: 2px;
  right: 5px;
  position: absolute;
  font-size: 0.75em;
  
  a {
    color: white;
    text-decoration: none;
    padding: 2px;
  }
  
  // Ensure icons are 24x24
  .v-icon {
    font-size: 24px !important;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}

// Styles for the small info popup
.info-popup-card {
  .v-card-text {
    font-family: 'Source Sans 3', 'Gill Sans', Calibri, sans-serif;
    
    p {
      margin-bottom: 8px;
      line-height: 1.4;
    }
  }
  
  a {
    color: #EBB68E; /* Pink primary - warm, readable color */
    text-decoration: none;
    padding: 1px;
    
    &:hover {
      color: #DF6E4B; /* Yellow primary - your main brand orange */
      text-decoration: underline;
    }
  }
}
</style>