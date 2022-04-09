<template>
  <div class="ma-0 pa-0 side-nav-container">
    <v-navigation-drawer v-show="showMenu" dark class="nav-drawer" permanent>
      <a class="wch-menu-logo outer lower" href="/"
        ><svg
          width="86"
          height="86"
          viewBox="0 0 86 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="margin-bottom: 5%"
        >
          <path d="M85.8974 0H0V85.8974H85.8974V0Z" fill="#FAD40A"></path>
          <path
            d="M67.893 70.8456V59.6943H58.201V70.8456H53V46H58.201V55.3553H67.893V46H73.131V70.8456H67.893Z"
            fill="black"
            stroke="black"
            stroke-width="0.205251"
          ></path>
          <path
            d="M58.1876 48.1384C57.9126 49.5608 57.4774 50.8457 56.8781 51.993C56.2788 53.1404 55.5234 54.1256 54.6142 54.9486C53.7029 55.7717 52.6499 56.408 51.4513 56.8575C50.2547 57.307 48.9308 57.5307 47.4858 57.5307C45.8643 57.5307 44.3475 57.2557 42.9395 56.7076C41.5295 56.1596 40.3144 55.3366 39.2922 54.2385C38.2701 53.1404 37.4655 51.7878 36.8785 50.1786C36.2915 48.5694 36 46.6935 36 44.5465C36 42.4509 36.2668 40.5606 36.8046 38.8775C37.3403 37.1945 38.1079 35.7721 39.1054 34.6124C40.103 33.4527 41.3201 32.562 42.7548 31.9359C44.1895 31.312 45.7905 31 47.5638 31C49.1094 31 50.5133 31.2299 51.7735 31.6917C53.0337 32.1535 54.1195 32.7898 55.0288 33.6005C55.9401 34.4113 56.6626 35.3657 57.1983 36.4638C57.734 37.5619 58.0644 38.7338 58.1896 39.9818H52.9886C52.6397 38.5594 51.9664 37.4572 50.9669 36.6711C49.9694 35.885 48.8466 35.4929 47.5987 35.4929C45.4292 35.4929 43.8324 36.2729 42.8082 37.8307C41.786 39.3906 41.2749 41.5294 41.2749 44.2489C41.2749 47.0178 41.7799 49.1688 42.7897 50.7041C43.7995 52.2373 45.3163 53.0049 47.336 53.0049C48.8815 53.0049 50.1233 52.5883 51.0592 51.7508C51.9952 50.9155 52.6356 49.7106 52.9865 48.1405H58.1876V48.1384Z"
            fill="black"
            stroke="black"
            stroke-width="0.205251"
          ></path>
          <path
            d="M31.6815 39.8456L27.8269 23.6821L23.8984 39.8456H19.0339L12 15H17.5377L21.616 31.0896L25.058 15H30.5218L34.3005 31.0896L38.3419 15H43.6558L36.6958 39.8456H31.6815Z"
            fill="black"
            stroke="black"
            stroke-width="0.205251"
          ></path></svg
      ></a>
      <div class="ant-layout-sider-children">
        <div class="css-19iid9s">
          <a class="wch-menu-logo upper" href="/"
            ><svg
              width="86"
              height="86"
              viewBox="0 0 86 86"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style="margin-bottom: 5%"
            >
              <path d="M85.8974 0H0V85.8974H85.8974V0Z" fill="#FAD40A"></path>
              <path
                d="M67.893 70.8456V59.6943H58.201V70.8456H53V46H58.201V55.3553H67.893V46H73.131V70.8456H67.893Z"
                fill="black"
                stroke="black"
                stroke-width="0.205251"
              ></path>
              <path
                d="M58.1876 48.1384C57.9126 49.5608 57.4774 50.8457 56.8781 51.993C56.2788 53.1404 55.5234 54.1256 54.6142 54.9486C53.7029 55.7717 52.6499 56.408 51.4513 56.8575C50.2547 57.307 48.9308 57.5307 47.4858 57.5307C45.8643 57.5307 44.3475 57.2557 42.9395 56.7076C41.5295 56.1596 40.3144 55.3366 39.2922 54.2385C38.2701 53.1404 37.4655 51.7878 36.8785 50.1786C36.2915 48.5694 36 46.6935 36 44.5465C36 42.4509 36.2668 40.5606 36.8046 38.8775C37.3403 37.1945 38.1079 35.7721 39.1054 34.6124C40.103 33.4527 41.3201 32.562 42.7548 31.9359C44.1895 31.312 45.7905 31 47.5638 31C49.1094 31 50.5133 31.2299 51.7735 31.6917C53.0337 32.1535 54.1195 32.7898 55.0288 33.6005C55.9401 34.4113 56.6626 35.3657 57.1983 36.4638C57.734 37.5619 58.0644 38.7338 58.1896 39.9818H52.9886C52.6397 38.5594 51.9664 37.4572 50.9669 36.6711C49.9694 35.885 48.8466 35.4929 47.5987 35.4929C45.4292 35.4929 43.8324 36.2729 42.8082 37.8307C41.786 39.3906 41.2749 41.5294 41.2749 44.2489C41.2749 47.0178 41.7799 49.1688 42.7897 50.7041C43.7995 52.2373 45.3163 53.0049 47.336 53.0049C48.8815 53.0049 50.1233 52.5883 51.0592 51.7508C51.9952 50.9155 52.6356 49.7106 52.9865 48.1405H58.1876V48.1384Z"
                fill="black"
                stroke="black"
                stroke-width="0.205251"
              ></path>
              <path
                d="M31.6815 39.8456L27.8269 23.6821L23.8984 39.8456H19.0339L12 15H17.5377L21.616 31.0896L25.058 15H30.5218L34.3005 31.0896L38.3419 15H43.6558L36.6958 39.8456H31.6815Z"
                fill="black"
                stroke="black"
                stroke-width="0.205251"
              ></path></svg
          ></a>
          <div class="menu-mobile-close-btn" @click="hideMobileMenu()">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              icon="close"
              style="cursor: pointer"
            >
              <path
                d="M16.3575 1.64215L1.61394 16.3857"
                stroke="#FAD40A"
                stroke-width="1.32678"
                stroke-linecap="round"
              ></path>
              <path
                d="M1.61334 1.64106L16.3569 16.3846"
                stroke="white"
                stroke-width="1.32678"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
          <h4 class="ant-typography css-16shlwq" weight="bold" mb="1" mt="2">
            Menu
          </h4>
          <div class="list-container">
            <a class="css-1xqwpqk" href="/stories"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Stories Home
              </div></a
            ><a class="css-1xqwpqk" href="/index"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Index
              </div></a
            ><a
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
              href="https://workingclasshistory.com/sign-up/"
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
            ><a class="css-1xqwpqk" href="/contribute"
              ><div
                class="ant-typography css-107d6n4"
                weight="regular"
                color="neutral"
              >
                Contribute
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
export default {
  name: "SideNav",
  data() {
    return {
      expanded: false,
      orientation: "landscape",
    };
  },
  mounted() {
    this.orientation = this.getOrientation();
    let self = this;
    window.addEventListener("resize", () => {
      self.orientation = self.getOrientation();
    });
    EventBus.$on("open-main-menu", () => {
      self.expanded = true;
    });
  },
  methods: {
    hideMobileMenu() {
      EventBus.$emit("close-main-menu");
      this.$store.commit('setNavMenuExpanded', false);
      this.expanded = false;
    },
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
<style>
.nav-drawer {
  max-height: fit-content;
  background-color: black !important;
  position: absolute;
}
.list-container a,
.list-container .ant-typography {
  font-family: Roboto, sans-serif;
  text-decoration: none;
  color: white;
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
}

.side-nav-container aside {
  min-width: 160px;
}

.ant-typography {
  font-family: "ZillaSlab";
}
.ant-layout-sider-children a {
  color: white;
}
.ant-layout-sider-children {
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