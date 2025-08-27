<template>
  <v-footer color=" #020202"
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
    <div id="aboutIcon" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1297">
      <AboutMap />
    </div>
  </v-footer>
</template>

<script>
import AboutMap from './AboutMap.vue';
export default {
  name: "MainFooter",
  components: {AboutMap}
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
  
  // Ensure AboutMap icons are also 24x24
  .v-icon {
    font-size: 24px !important;
    width: 24px;
    height: 24px;
  }
}
</style>