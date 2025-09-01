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
      <v-toolbar dark color="#DF6E4B">
        <v-btn icon dark @click="aboutMapExpanded = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <h3 style="font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-size: 24px">
            General Strike 100
          </h3>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p>
          National museums, libraries, archives, and history groups are collaborating together to celebrate the 100th anniversary of the General Strike of 1926.
        </p>
        <p>
          In partnership with the trade union and wider labour movement, our project aims to develop an interactive map of sites for public visitation throughout 2026. This may include details of a specific exhibition, an educational event, or a unique collection to explore, all part of our rich history of the General Strike.
        </p>
        <p>
          Accompanying the interactive website, we plan to distribute a printed passport, encouraging public participation in visiting these sites and collecting stamps from each organisation they visit. This will provide discounts on related merchandise and foster a desire to visit as many sites as possible throughout the year.
        </p>
        <p>
          We are seeking donations from organisations and individuals to help us cover costs, <a href="https://bit.ly/GeneralStrike100" target="_blank">click here</a> to support this project.
        </p>
        <p>
          If you want to get involved in the partnership, please contact <a href="mailto:campaigns@gftu.org.uk">campaigns@gftu.org.uk</a>.
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
        font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif !important;
      }
    }
    .v-card-text {
      p {
        padding-bottom: 0.5em;
        font-family: 'Source Sans 3', 'Gill Sans', Calibri, sans-serif;
        line-height: 1.5;
      }
    }
  }
  a {
    color: #EBB68E; /* Updated to brand brown color */
    text-decoration: none;
    padding: 2px;
    
    &:hover {
      color: #BE864A; /* Brand orange on hover */
      text-decoration: underline;
    }
  }
}
</style>