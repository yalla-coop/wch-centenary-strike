<template>
  <v-navigation-drawer
      id="advancedSearchNav"
      v-model="advancedSearchExpanded"
      theme="dark"
      temporary
      :style="{'transform': 'translateX(' + translateX + ')'}"
      @update:modelValue="(val) => { if(!val) {this.clearSelectFocused()}}"
  >
    <v-col id="advancedSearchForm">
      <v-btn @click="setDateToday" :ripple="false" color="#FAD40A" class="mb-2 text-left pl-0" variant="plain">
        On this day
      </v-btn>
      <h3>Filter results by:</h3>
      <v-divider class="mb-2" />
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
      <v-divider class="mb-2" />
      <v-row align="center">
        <v-select
            class="month-input"
            label="Month"
            ref="month"
            clearable
            v-model="month"
            @update:modelValue="applySearchFilters"
            :items="getMonthOptions()"
            item-title="title"
            item-value="value"
        ></v-select>
        <v-icon class="mb-5 v-label" icon="mdi-minus"></v-icon>
        <v-select
            class="day-input"
            label="Day"
            ref="day"
            clearable
            :disabled="!this.month"
            v-model="day"
            @update:modelValue="applySearchFilters"
            :items="dayOptions"
            item-title="label"
            item-value="value"
        ></v-select>
      </v-row>
      <v-row align="center" justify="space-between">
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
import {getMonthOptions} from '../js/helpers/dateHelpers.js';

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
    day: {
      get() {return this.$store.getters.getDay},
      set(val) {this.$store.commit('setDay', val)}
    },
    month: {
      get() {return this.$store.getters.getMonth},
      set(val) {this.$store.commit('setMonth', val)}
    },
    dayOptions: function () {
      let date = new Date(2020, this.month, 0).getDate()
      let options = Array(date).fill(0).map((v,i)=>++i).map((d) => {
        return { value: d, label: d}
      })
      options.push({value: 0, label: 'n/a'})
      return options
    },
    translateX: function () {
      return this.advancedSearchExpanded ? '0px' : '-110%'
    }
  },
  data() {
    return {
      items:  Object.fromEntries(categories.map(category => [category, []])),
      search: Object.fromEntries(categories.map(category => [category, null])),
      select: Object.fromEntries(categories.map(category => [category, []])),
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
  updated() {
    const showOnLoad = this.$store.getters.getAdvancedSearchExpandedOnLoad

    if(showOnLoad){
      this.advancedSearchExpanded = true
      this.$store.commit('setAdvancedSearchExpandedOnLoad', false)
    }
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
    anyFilterApplied() {
      return Object.values(this.select).some(arr => arr.length > 0) || this.startYear || this.endYear || this.month || this.day != null
    },
    validRange() {
      return !(this.startYear && this.endYear &&
        (+this.startYear > +this.endYear || +this.endYear < +this.startYear));
    },
    dateString,
    getMonthOptions,
    setDateToday () {
      let date = new Date
      this.day = date.getDate()
      this.month = date.getMonth() + 1
      this.applySearchFilters()
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
      if(this.month == null) {this.day = null}
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
      this.startYear = '';
      this.endYear = '';
      this.day = null;
      this.month = null;
      this.applySearchFilters()
    },
    // Returns feature ids with AT LEAST ONE tag in EACH of the filtered categories
    getFeatureIdsMatchingFilters() {
      let peopleIds = [...this.select.people.map(t => t.id)]
      let organisationsIds = [...this.select.organisations.map(t => t.id)]
      let topicsIds = [...this.select.topics.map(t => t.id)]
      let countriesIds = [...this.select.countries.map(t => t.id)]
      let allFeatures = this.$store.getters.getFeatureCollection.features

      let filteredFeatures = allFeatures.filter((feature) => {
        let featureTags = feature.properties.tags.map(tag => tag.id)

        return (featureTags.some(t => peopleIds.includes(t)) || peopleIds.length === 0) &&
          (featureTags.some(t => organisationsIds.includes(t)) || organisationsIds.length === 0) &&
          (featureTags.some(t => topicsIds.includes(t)) || topicsIds.length === 0) &&
          (featureTags.some(t => countriesIds.includes(t)) || countriesIds.length === 0)
      })
      if(this.month) {
        filteredFeatures = filteredFeatures.filter((feature) => {
          return +feature.properties.month === this.month
        })
      }
      if (this.day != null) {
        filteredFeatures = filteredFeatures.filter((feature) => {
          // Will cast null values to 0 (undated)
          return +feature.properties.day === this.day
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
<style lang="scss">
#advancedSearchForm {
  .year-input {
    input {
      text-align: center;
    }
  }
}
</style>
<style lang="scss" scoped>
#advancedSearchForm {
  padding: 1em;
  .v-row {
    margin-top: 0;
    margin-bottom: .5em;
    .year-input {
      max-width: 10em;
    }
    .month-input {
      width: 10em;
    }
    .day-input {
      width: 6em
    }
  }
  h3 {
    font-family: 'ZillaSlab';
  }
}
</style>
