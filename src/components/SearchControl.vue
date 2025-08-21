<template>
  <span id="searchControl" class="mapboxgl-ctrl">
      <div class="d-flex">
        <v-form id="searchControlForm" @submit.prevent>
          <v-text-field
             density="compact"
             label="Search events"
             variant="outlined"
             bg-color="white"
             theme="light"
             append-inner-icon="mdi-map-search-outline"
             single-line
             :disabled="this.$store.getters.getFiltersActive"
             clearable
             hide-details
             :color="this.$store.getters.getSearchInputColor"
             v-model="searchText"
             @click:append-inner="this.search(this.searchText)"
             @click:clear="clearPanel"
             @keyup.enter="this.search(this.searchText)"
             @update:modelValue="resetStyling"
          >
          <template v-slot:loader>
            <v-progress-linear
                :active="this.$store.getters.getSearchLoading"
                color="#FAD40A"
                indeterminate
            />
          </template>
        </v-text-field>
      </v-form>

    </div>
  </span>
</template>
<script>
  export default {
    props: ['search', 'clearSearch', 'clearResults'],
    computed: {
      searchText: {
        get() { return this.$store.getters.getSearchText },
        set(val) { this.$store.commit('setSearchText', val) }
      }
    },
    mounted() {},
    methods: {
      clearPanel(){
        this.clearResults()
        this.clearSearch()
      },
      resetStyling(){
        this.$store.commit('setSearchInputColor', 'white');
        if(this.$map.getFilter('events-circles')) {
          this.$layerManager.clearCircleFeatureStyling()
        }

      }
    }
  }
</script>

<style lang="scss">
#searchControl {
  #searchFilters {
    height: unset;
    min-width: 4em;
    background-color: white;
    &.active {
      color: #6013FB;
      border-color: #6013FB;
      border-radius: 5px;
      border-width: 2px;
      border-style: solid;
    }
  }
  #searchControlForm {
    width: 20em;
    .v-field {
      border-radius: 4px 0 0 4px;
    }
    .v-field__outline {
      border-radius: 4px 0 0 4px;
    }
    .v-field__outline__end {
      border-radius: 0;
    }
  }
}
</style>
