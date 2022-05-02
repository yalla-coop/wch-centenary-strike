<template>
  <v-footer color="rgb(18, 2, 50)"
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
              ><v-icon dark class="icon-class">mdi-instagram</v-icon></a
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
              ><v-icon dark class="icon-class">mdi-facebook</v-icon></a
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
              ><v-icon dark class="icon-class">mdi-twitter</v-icon></a
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
              ><v-icon dark class="icon-class">mdi-spotify</v-icon></a
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
              href="https://workingclasshistory.tumblr.com/"
              onclick="javascript:window.open('https://workingclasshistory.tumblr.com/'); return false;"
            >
              <img
                width="25px"
                class="v-icon v-icon"
                src="assets/icons/ico_tumblr.svg"
                alt="tumblr"
              />
            </a>
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
              ><v-icon dark class="icon-class">mdi-youtube</v-icon></a
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
            >
              <img
                width="22px"
                class="v-icon v-icon"
                src="assets/icons/ico_pintrest.svg"
                alt="pintrest"
              />
            </a>
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
              ><v-icon dark class="icon-class">mdi-mastodon</v-icon></a
            >
          </li>
          <!-- <li
            id="menu-item-1297"
            class="
              menu-item
              menu-item-type-custom
              menu-item-object-custom
              menu-item-1297
            "
          >
            <a
              href="https://tiktok.com/@workingclasshistory"
              onclick="javascript:window.open('https://tiktok.com/@workingclasshistory'); return false;"
              ><v-icon dark class="icon-class">mdi-tiktok</v-icon></a
            >
          </li> -->
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
              href="https://tiktok.com/@workingclasshistory"
              onclick="javascript:window.open('https://tiktok.com/@workingclasshistory/'); return false;"
            >
              <img
                width="22px"
                class="v-icon v-icon"
                src="assets/icons/ico_tiktok.svg"
                alt="tumblr"
              />
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <div
      id="wijfi"
      class="
        menu-item menu-item-type-custom menu-item-object-custom menu-item-1297
      "
    >
      <a
        href="https://github.com/Willjfield/WCH_Map"
        onclick="javascript:window.open('https://github.com/Willjfield/WCH_Map'); return false;"
        >map by will field <v-icon dark small class="icon-class">mdi-github</v-icon></a
      >
    </div>
  </v-footer>
</template>

<script>
export default {
  name: "MainFooter",
};
</script>

<style>
.v-footer {
  z-index: 9;
  background-color: rgb(18, 2, 50);
  box-shadow: #4e4e4e66 0px 0px 16px;
  border-color: rgb(18, 2, 50);
}

#wijfi,
#wijfi a {
  color: lightgray;
  text-decoration: none;
  padding: 2px;
}

#wijfi {
  right: 5px;
  position: absolute;
  font-size: 0.75em;
}
/* .icon-class{
  color:white;
} */
</style>