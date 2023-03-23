<template>
  <span id="searchControl" class="mapboxgl-ctrl">
    <v-form id="searchControlForm" @submit.prevent>
       <v-text-field
           density="compact"
           label="Search events"
           variant="outlined"
           bg-color="white"
           theme="light"
           append-inner-icon="mdi-map-search-outline"
           single-line
           clearable
           hide-details
           :color="this.searchInputColor"
           v-model="searchText"
           @click:append-inner="this.search(this.searchText)"
           @click:clear="clearPanel"
           @keyup.enter="this.search(this.searchText)"
           @update:modelValue="resetStyling"
       >
         <template v-slot:loader>
          <v-progress-linear
              :active="this.searchLoading"
              color="#FAD40A"
              indeterminate
          ></v-progress-linear>
         </template>
       </v-text-field>
    </v-form>
  </span>
</template>
<script>
  import {EventBus} from '../js/DataManagement/EventBus.js';

  export default {
    props: ['search', 'clearSearch', 'clearResults'],
    data: () => ({
      searchText: '',
      searchLoading: false,
      searchInputColor: 'white'
    }),
    mounted: function () {
      EventBus.$on('setSearchLoading', (searchLoading) => {
        this.searchLoading = searchLoading
      })
      EventBus.$on('setSearchText', (searchText) => {
        this.searchText = searchText
      })
      EventBus.$on('setSearchInputColor', (searchInputColor) => {
        this.searchInputColor = searchInputColor
      })
    },
    methods: {
      clearPanel(){
        this.clearResults()
        this.clearSearch()
      },
      resetStyling(){
        this.searchInputColor = 'white';
        if(this.$map.getFilter('events-circles')) {
          this.$layerManager.clearCircleFeatureStyling()
        }

      }
    }
  }
</script>

<style lang="scss">
#searchControlForm {
  width: 20em;
}
</style>
