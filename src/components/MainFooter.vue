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
              ><v-icon dark color="white" class="icon-class">mdi-instagram</v-icon></a
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
              ><v-icon dark color="white" class="icon-class">mdi-facebook</v-icon></a
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
  background-color: #020202; /* Changed from rgb(18, 2, 50) */
  border-color: #020202;
}
#aboutIcon {
  color: lightgray;
  text-decoration: none;
  padding: 2px;
  right: 5px;
  position: absolute;
  font-size: 0.75em;
  a {
    color: lightgray;
    text-decoration: none;
    padding: 2px;
  }
}
</style>