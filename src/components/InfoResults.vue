<template>
  <div id="info-results">
    <v-card id="search-results" class="mx-auto" max-width="300" tile>
      <h3> {{title}} </h3>
      <v-list style="font-family: 'Roboto'" dense>
        <span style="padding: 10px">Select one:</span>
        <v-divider></v-divider>
        <v-item-group color="primary">
          <v-list-item v-for="(d, i) in results"
            :title="formatTitleYear(d)"
            @click="selectResult(d.id, {forSearch: forSearch()})"
            @mouseover="forSearch() && searchHighlight(d.id)"
            @mouseleave="forSearch() && clearSearchHighlight()"
            density="compact"
            :key="i"
          />
        </v-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { formatTitleYear } from '../js/helpers/stringHelpers.js';
import * as palettes from '../js/mapbox/propertyPalettes.js'
import {highlightedColorsForFeatures} from '../js/mapbox/propertyPalettes.js';

export default {
  props: ['results', 'selectResult', 'title'],
  data() {
    return {}
  },
  methods: {
    formatTitleYear,
    forSearch(){
      return this.title === 'Search Results'
    },
    searchHighlight(id) {
      this.$map.setPaintProperty("events-circles", 'circle-radius', palettes.highlightRadiusForResults([id]))
      this.$map.setPaintProperty("events-circles", 'circle-color', highlightedColorsForFeatures([id]))
      this.$map.setLayoutProperty("events-circles", "circle-sort-key", palettes.highlightSortForResults([id]))
    },
    clearSearchHighlight() {
      let resultIds = this.results.map((r) => {return r.id})
      this.$map.setPaintProperty("events-circles", 'circle-radius', palettes.highlightRadiusForResults([]))
      this.$map.setPaintProperty("events-circles", 'circle-color', highlightedColorsForFeatures(resultIds))
      this.$map.setLayoutProperty("events-circles", "circle-sort-key", palettes.highlightSortForResults([]))
    }
  }
}
</script>

<style lang="scss">
#search-results {
  border-radius: 0;
  h3 {
    background: #FAD40A;
    text-align: center;
    padding: 5px;
    font-family: "ZillaSlab";
  }
  .v-list-item {
    border-bottom: 1px solid #d1d0d0;
  }
  .v-list-item-title {
    font-size: .8125rem;
    font-weight: bold;
  }
}
</style>
