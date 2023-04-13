<template>
  <v-dialog
    id="about"
    v-model="aboutMapExpanded"
    :fullscreen="getOrientation() === 'portrait'"
    theme="dark"
    scrim="black"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">
      <v-icon icon="mdi-information-slab-circle-outline" v-bind="props"></v-icon>
    </template>
    <v-card>
      <v-toolbar dark color="#FAD40A">
        <v-btn icon dark @click="aboutMapExpanded = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <h3 style="font-family: 'ZillaSlab'; font-size: 24px">
            About this map
          </h3>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p>
          We have been able to develop this Map and Stories app thanks to generous support from our backers on
          <a href="https://patreon.com/workingclasshistory">patreon</a>, and some fantastic people who contributed to a
          GoFundMe campaign. With our GoFundMe we attempted to raise $8000 to cover the cost of the development of these
          apps. We were able to raise approximately $3000, and so there remains a significant shortfall. We also plan to
          continue rolling out significant improvements to the apps over time. Running and maintaining these new apps also
          means increased costs for us every month on an ongoing basis. So if you can, please consider supporting us on
          <a href="https://patreon.com/workingclasshistory">patreon</a> or giving us a
          <a href="https://workingclasshistory.com/support">one-off donation</a> to help cover our costs.
        </p>
        <p>
          If you are interested in collaborating with us and contributing data for the map, or if you spot any errors,
          please email us at <a href="mailto: info@workingclasshistory.com">info@workingclasshistory.com</a>.
        </p>
      </v-card-text>
      <v-card-actions class="justify-end">
        <p>
          Map by
          <a href="https://github.com/Willjfield"
             onclick="javascript:window.open('https://github.com/Willjfield'); return false;"
          >will field <v-icon dark small class="icon-class">mdi-github</v-icon></a>
          and
          <a href="https://github.com/todtb"
             onclick="javascript:window.open('https://github.com/todtb'); return false;"
          >brian todt <v-icon dark small class="icon-class">mdi-github</v-icon></a>
        </p>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {getOrientation} from '../js/helpers/orientationHelpers.js';

export default {
  name: 'AboutMap',
  data: function() {
    return {
      aboutMapExpanded: false
    }
  },
  methods: {
    getOrientation
  }
}
</script>

<style lang="scss" scoped>
#about {
  padding: 5px;
  .v-card {
    .v-toolbar {
      color: black;
      text-align: left;
      .v-toolbar-title {
        font-weight: bold;
      }
    }
    .v-card-text {
      p {
        padding-bottom: 0.5em
      }
    }
  }
  a {
    color: darkgrey;
    text-decoration: none;
    padding: 2px;
  }
}
</style>
