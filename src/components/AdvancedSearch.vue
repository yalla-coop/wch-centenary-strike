<template>
  <v-navigation-drawer
      id="advancedSearchNav"
      v-model="advancedSearchExpanded"
      theme="dark"
      temporary
      @update:modelValue="(val) => { if(!val) {this.clearSelectFocused()}}"
      :width="this.filterNavWidth()"
  >
    <v-col id="advancedSearchForm">
      <v-switch
          v-model="onThisDay"
          @update:modelValue="applySearchFilters"
          inset
          :ripple=false
          hide-details
          color="#FAD40A"
          :label="`Show stories on this day, ${dateString(new Date)}`"
      ></v-switch>
      <h3>Filter results by:</h3>
      <v-row v-for="category in categories" :key="category">
        <v-autocomplete
            :ref="`${category}Select`"
            chips
            closable-chips
            clearable
            :label="category[0].toUpperCase() + category.substring(1)"
            v-model="select[category]"
            @update:modelValue="applySearchFilters"
            :items="items[category]"
            v-model:search="search[category]"
            hide-no-data
            hide-details
            item-text="Title"
            item-title="Title"
            item-value="id"
            multiple
            return-object
        ></v-autocomplete>
      </v-row>
      <v-row justify="space-around" align="center">
        <v-text-field
          class="year-input"
          ref="startYear"
          v-model="startYear"
          :rules="[rules.year, rules.validRange]"
          @update:modelValue="applySearchFilters"
          label="Start year"
        ></v-text-field>
        <v-icon class="mb-5 v-label" icon="mdi-arrow-left-right"></v-icon>
        <v-text-field
          class="year-input"
          ref="endYear"
          v-model="endYear"
          :rules="[rules.year, rules.validRange]"
          @update:modelValue="applySearchFilters"
          label="End year"
        ></v-text-field>
      </v-row>
      <v-row justify="end">
        <v-btn @click="clearSearchFilters" variant="plain">
          Clear All
        </v-btn>
      </v-row>
    </v-col>
  </v-navigation-drawer>
</template>

<script>
import {EventBus} from '../js/DataManagement/EventBus.js';
import {dateString} from '../js/helpers/stringHelpers.js';
import {getOrientation} from '../js/helpers/orientationHelpers.js';

const categories = ['topics', 'people', 'organisations', 'countries']

export default {
  setup() {
    return { categories }
  },
  name: 'AdvancedSearch',
  computed: {
    advancedSearchExpanded: {
      get() {return this.$store.getters.getAdvancedSearchExpanded},
      set(val) {this.$store.commit('setAdvancedSearchExpanded', val)}
    },
    navTouchless: function () {
      return this.advancedSearchExpanded && this.anySelectFocused()
    }
  },
  data() {
    return {
      items:  Object.fromEntries(categories.map(category => [category, []])),
      search: Object.fromEntries(categories.map(category => [category, null])),
      select: Object.fromEntries(categories.map(category => [category, []])),
      onThisDay: false,
      startYear: '',
      endYear: '',
      rules: {
        year: value => { return (value === '' || /^-?(\d{1,4})$/.test(value)) || 'invalid year' },
        validRange: value => { return this.validRange() || 'invalid range'}
      }
    }
  },
  created() {
    // Autocomplete search watchers
    categories.forEach(category => {
      this.$watch(`search.${category}`, (val) => {
        val && val !== this.select[category] && this.querySelections(val, category)
      })
    })
  },
  mounted() {
    EventBus.$on('clear-filters', () => { this.clearSearchFilters() })
  },
  watch: {
    startYear() {
      this.$nextTick(() => {this.$refs.endYear.validate();});
    },
    endYear() {
      this.$nextTick(() => {this.$refs.startYear.validate();});
    }
  },
  methods: {
    clearSelectFocused() {
      categories.forEach(category => { this.$refs[`${category}Select`][0].isFocused = false})
    },
    anySelectFocused() {
      return categories.some(category => { return this.$refs[`${category}Select`][0].isFocused })
    },
    anyFilterApplied() {
      return Object.values(this.select).some(arr => arr.length > 0) || this.onThisDay || this.startYear || this.endYear
    },
    validRange() {
      return !(this.startYear && this.endYear &&
        (+this.startYear > +this.endYear || +this.endYear < +this.startYear));
    },
    dateString,
    filterNavWidth() {
      return getOrientation() === 'portrait'
          ? `${document.documentElement["clientWidth"] * 0.8 }`
          : '400px';
    },
    querySelections(val, category) {
      // Debounce for v-overlay location issues
      clearTimeout(this._querySearchDelay)
      this._querySearchDelay = setTimeout(() => {
        this.items[category] = this.$store.getters.getCategoryTags(category).filter(e => {
          return (e['Title'] || '').toLowerCase().indexOf((val || '').toLowerCase()) > -1
        }).slice(0, 50)
      }, 200)
    },
    applySearchFilters() {
      if(this.anyFilterApplied()) {
        this.$store.commit('setFiltersActive', true)
        EventBus.$emit('clear-results-and-search')
        let featureIdsToFilter = this.getFeatureIdsMatchingFilters()
        this.$layerManager.filterResults(featureIdsToFilter)
      } else {
        this.$store.commit('setFiltersActive', false)
        this.$layerManager.clearFilter()
        this.$layerManager.clearCircleFeatureStyling()
      }
    },
    clearSearchFilters() {
      categories.forEach(category => { this.select[category] = [] });
      this.onThisDay = false;
      this.startYear = '';
      this.endYear = '';
      this.applySearchFilters()
    },
    // Returns feature ids with AT LEAST ONE tag in EACH of the filtered categories
    getFeatureIdsMatchingFilters() {
      let peopleIds = [...this.select.people.map(t => t.id)]
      let organisationsIds = [...this.select.organisations.map(t => t.id)]
      let topicsIds = [...this.select.topics.map(t => t.id)]
      let countriesIds = [...this.select.countries.map(t => t.id)]
      let allFeatures = this.$store.getters.getFeatureCollection.features
      let currentDate = new Date()

      let filteredFeatures = allFeatures.filter((feature) => {
        let featureTags = feature.properties.tags.map(tag => tag.id)

        return (featureTags.some(t => peopleIds.includes(t)) || peopleIds.length === 0) &&
          (featureTags.some(t => organisationsIds.includes(t)) || organisationsIds.length === 0) &&
          (featureTags.some(t => topicsIds.includes(t)) || topicsIds.length === 0) &&
          (featureTags.some(t => countriesIds.includes(t)) || countriesIds.length === 0)
      })
      if(this.onThisDay) {
        filteredFeatures = filteredFeatures.filter((feature) => {
          return +feature.properties.month === (currentDate.getMonth() + 1) &&
                 +feature.properties.day === currentDate.getDate()
        })
      }
      if(this.startYear.length > 0) {
        filteredFeatures = filteredFeatures.filter((feature) => {
          return +feature.properties.year >= +this.startYear
        })
      }
      if(this.endYear.length > 0) {
        filteredFeatures = filteredFeatures.filter((feature) => {
          return +feature.properties.year <= +this.endYear
        })
      }

      return filteredFeatures.map(feature => feature.properties.id)
    }
  },
}
</script>

<style lang="scss" scoped>
#advancedSearchForm {
  padding: 1em;
  .v-row {
    padding-top: 1.5em;
    .year-input {
      max-width: 7em;
    }
  }
  h3 {
    font-family: 'ZillaSlab';
  }
}
</style>
