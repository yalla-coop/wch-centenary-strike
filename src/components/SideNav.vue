<template>
  <div class="ma-0 pa-0 side-nav-container">
    <v-navigation-drawer v-if="showMenu" dark class="nav-drawer" permanent absolute>
      <a class="wch-menu-logo outer lower" @click="resetView()"
        >
        <svg
  width="86"
  height="86"
  viewBox="0 0 86 86"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style="margin-bottom: 5%"
>
  <!-- Background -->
  <rect width="86" height="86" fill="#DF6E4B"/>

  <!-- Big "100" -->
  <text
    x="43"
    y="50"
    font-size="36"
    font-weight="900"
    text-anchor="middle"
    fill="black"
    font-family="Arial, Helvetica, sans-serif"
  >
    100
  </text>

  <!-- Red bars -->
  <rect x="10" y="30" width="66" height="7" fill="#E10600"/>
  <rect x="10" y="40" width="66" height="7" fill="#E10600"/>

  <!-- "GENERAL" text -->
  <text
    x="43"
    y="36"
    font-size="7"
    font-weight="600"
    text-anchor="middle"
    fill="white"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="2"
  >
    GENERAL
  </text>

  <!-- "STRIKE" text -->
  <text
    x="43"
    y="46"
    font-size="7"
    font-weight="600"
    text-anchor="middle"
    fill="white"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="2"
  >
    STRIKE
  </text>

  <!-- "1926–2026" -->
  <text
    x="43"
    y="72"
    font-size="9"
    text-anchor="middle"
    fill="black"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="1.5"
  >
    1926–2026
  </text>
</svg>

</a>
      <div class="ant-layout-sider-children">
        <div class="css-19iid9s">
          <a class="wch-menu-logo upper" @click="resetView()"
            >
           <svg
  width="86"
  height="86"
  viewBox="0 0 86 86"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style="margin-bottom: 5%"
>
  <!-- Background -->
  <rect width="86" height="86" fill="#DF6E4B"/>

  <!-- Big "100" -->
  <text
    x="43"
    y="50"
    font-size="36"
    font-weight="900"
    text-anchor="middle"
    fill="black"
    font-family="Arial, Helvetica, sans-serif"
  >
    100
  </text>

  <!-- Red bars -->
  <rect x="10" y="30" width="66" height="7" fill="#E10600"/>
  <rect x="10" y="40" width="66" height="7" fill="#E10600"/>

  <!-- "GENERAL" text -->
  <text
    x="43"
    y="36"
    font-size="7"
    font-weight="600"
    text-anchor="middle"
    fill="white"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="2"
  >
    GENERAL
  </text>

  <!-- "STRIKE" text -->
  <text
    x="43"
    y="46"
    font-size="7"
    font-weight="600"
    text-anchor="middle"
    fill="white"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="2"
  >
    STRIKE
  </text>

  <!-- "1926–2026" -->
  <text
    x="43"
    y="72"
    font-size="9"
    text-anchor="middle"
    fill="black"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="1.5"
  >
    1926–2026
  </text>
</svg>

          </a>
          <div class="menu-mobile-close-btn" @click="hideMobileMenu()">
            <svg
  width="86"
  height="86"
  viewBox="0 0 86 86"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style="margin-bottom: 5%"
>
  <!-- Big "100" -->
  <text
    x="43"
    y="50"
    font-size="36"
    font-weight="900"
    text-anchor="middle"
    fill="black"
    font-family="Arial, Helvetica, sans-serif"
  >
    100
  </text>

  <!-- Red bars -->
  <rect x="10" y="30" width="66" height="7" fill="#E10600"/>
  <rect x="10" y="40" width="66" height="7" fill="#E10600"/>

  <!-- "GENERAL" text -->
  <text
    x="43"
    y="36"
    font-size="7"
    font-weight="600"
    text-anchor="middle"
    fill="white"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="2"
  >
    GENERAL
  </text>

  <!-- "STRIKE" text -->
  <text
    x="43"
    y="46"
    font-size="7"
    font-weight="600"
    text-anchor="middle"
    fill="white"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="2"
  >
    STRIKE
  </text>

  <!-- "1926–2026" -->
  <text
    x="43"
    y="72"
    font-size="9"
    text-anchor="middle"
    fill="black"
    font-family="Arial, Helvetica, sans-serif"
    letter-spacing="1.5"
  >
    1926–2026
  </text>
</svg>

          </div>
          <h3 class="ant-typography css-16shlwq" weight="bold" mb="1" mt="2">
            Menu
          </h3>
          <div class="list-container">
            <a class="css-1xqwpqk" :href="`${this.$baseurl}/stories`"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Stories
              </div></a
            >
            <!-- <a class="css-1xqwpqk" href="/index"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Index
              </div></a
            > -->
            <a
              target="_blank"
              class="css-1xqwpqk"
              href="https://workingclasshistory.com/podcast/"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Podcast
              </div></a
            ><a
              target="_blank"
              class="css-1xqwpqk"
              href="https://shop.workingclasshistory.com/pages/sign-up"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Sign Up
              </div></a
            ><a
              target="_blank"
              class="css-1xqwpqk"
              href="https://workingclasshistory.com/support/"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Support Us
              </div></a
            ><a
              target="_blank"
              class="css-1xqwpqk"
              href="https://shop.workingclasshistory.com/"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Shop
              </div></a
            ><a
              target="_blank"
              class="css-1xqwpqk"
              href="https://workingclasshistory.com/"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                WCH Home
              </div></a
            >
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { EventBus } from "../js/DataManagement/EventBus";
import { getOrientation } from '../js/helpers/orientationHelpers.js';
export default {
  name: "SideNav",
  data() {
    return {
      expanded: false,
      orientation: "landscape",
    };
  },
  mounted() {
    this.orientation = getOrientation();
    let self = this;
    window.addEventListener("resize", () => {
      self.orientation = getOrientation();
    });
    EventBus.$on("open-main-menu", () => {
      self.expanded = true;
      EventBus.$emit("force-info-close");
    });
  },
  methods: {
    hideMobileMenu() {
      EventBus.$emit("close-main-menu");
      this.$store.commit('setNavMenuExpanded', false);
      this.expanded = false;
    },
    resetView() {
      this.$store.commit("setSelectedEventId", -1);
      this.$map.flyTo({
        center: [0,0],
        zoom: 2,
        essential: true
      });
      EventBus.$emit("reset-info-panel");
      EventBus.$emit('clear-filters')
      this.hideMobileMenu();
    }
  },
  computed: {
    showMenu() {
      return (
        (this.expanded && this.orientation === "portrait") ||
        this.orientation === "landscape"
      );
    },
  },
};
</script>
<style lang="scss">
.nav-drawer {
  max-height: fit-content;
  background-color: black !important;
  position: absolute;
}
.wch-menu-logo {
  cursor: pointer;
}
.list-container {
  a {
    font-family: Roboto, sans-serif;
    text-decoration: none;
    color: white;
  }
  .ant-typography {
    font-family: Roboto, sans-serif;
    text-decoration: none;
    color: white;
  }
}
.side-nav-container {
  position: absolute;
  display: flex;
  min-height: 100vh;
  flex-direction: row;
  z-index: 3;
  font-family: "ZillaSlab";
  width: 160px;
  max-width: 15%;
  nav {
    min-width: 160px;
  }
}
.ant-typography {
  font-family: "ZillaSlab";
}
.ant-layout-sider-children {
  a {
    color: white;
  }
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  --antd-wave-shadow-color: #1890ff;
  --scroll-bar: 0;
  text-size-adjust: 100%;
  color: white;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: "tnum", "tnum";
  font-family: "Zilla Slab", serif;
  overflow-wrap: break-word;
  margin: 0 auto;
  text-align: left;
  padding: 25%;
  box-sizing: inherit;
  position: relative;
  transition: all 0.2s;
  background: transparent;
  flex: 0 0 20.416vw;
  max-width: 20.416vw;
  min-width: 20.416vw;
  width: 20.416vw;
}
</style>
