<template>
  <div id="info-panel">
    <div>
      <div id="results">
        <div v-if="panelDisplay() === 'intro'">
          <h3 style="font-family: 'ZillaSlab'; font-size: 24px">
            Working Class History | Map
          </h3>
          <br>
          <p>History isn't made by kings and politicians, it is made by us: billions of ordinary people.</p>
          <p>This is a map containing our always-growing archive of Stories of our collective struggles to build a better world. To see more information about any of the stories, like Sources, click the "Learn more" link at the bottom of each entry.</p>
          <p>Use the search box to search by key word or phrase, or click the filter button for advanced search options.</p>
          <!-- TODO: After #23 -->
          <p><a href="#" onclick="document.querySelector('#aboutIcon > i').click();event.preventDefault();">Learn more</a></p>
        </div>
        <div v-if="panelDisplay() === 'results'">
          <div @click="clearResults" class="close-btn">
            <v-icon dark class="close-btn">mdi-close</v-icon>
          </div>
          <InfoResults
            :results="results"
            :select-result="selectResult"
            title="Events near here"
            v-if="results.length > 1"
          />
          <div v-if="loading" class="side-loading">
            <v-progress-circular indeterminate color="white" />
          </div>
        </div>
        <div v-if="panelDisplay() === 'searchResults'">
          <div class="close-btn" @click="() => {
            clearResults();
            clearSearch()
          }" >
            <v-icon dark class="close-btn">mdi-close</v-icon>
          </div>
          <InfoResults
              :results="searchResults"
              :select-result="selectResult"
              title="Search Results"
              v-if="searchResults.length > 0"
          />
          <div v-if="loading" class="side-loading">
            <v-progress-circular indeterminate color="white" />
          </div>
        </div>
        <div v-if="panelDisplay() === 'event'">
          <div @click="clearResults" class="close-btn">
            <v-icon dark class="close-btn">mdi-close</v-icon>
          </div>
          <EventDetails :event="selectedDat[0]" :zoom-to="zoomTo" />
          <div v-if="loading" class="side-loading">
            <v-progress-circular indeterminate color="white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../js/DataManagement/EventBus";
import { getOrientation } from '../js/helpers/orientationHelpers.js';
import * as baserowApi from '../js/baserow/api.js'
import InfoResults from './InfoResults.vue';
import {h, render} from 'vue';
import SearchControl from './SearchControl.vue';
import mapboxgl from 'mapbox-gl';
import EventDetails from './EventDetails.vue';

export default {
  name: "InfoPanel",
  components: {EventDetails, InfoResults},
  data: function () {
    return {
      selectedDat: [],
      loading: true,
      results: [],
      searchResults: [],
      resultsType: 'nearby',
    };
  },
  mounted: function () {
    EventBus.$on("clear-event", () => this.clearResults());
    EventBus.$on("new-panel", (dat) => {
      this.clearResults();
      this.setData(dat);
    });
    EventBus.$on("reset-info-panel", () => {
      this.clearResults();
      this.clearSearch()
    });
    EventBus.$on("select-from-url", (datId) => { this.loadEvent(datId) });
    EventBus.$on('clear-results-and-search', () => {
      // TODO: Post-MVP: issue when search is active and clicking applying filters, multiselect floats?
      // this.clearResults()
      this.clearSearch()
    })

    // Mount search control to mapbox
    let el = document.querySelector('.mapboxgl-ctrl-top-right')
    let vNode = h(SearchControl, {
        search: this.search,
        clearSearch: this.clearSearch,
        clearResults: this.clearResults
      }, {},
    )
    vNode.appContext = this.$.appContext
    if (el) render(vNode, el)
    this.$map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        })
    );
  },
  methods: {
    clearResults() {
      this.selectedDat = []
      this.$store.commit('setSearchInputColor', 'white')
      this.results = []
      this.resultsType = 'nearby'
      this.$store.commit("setSelectedEventId", -1)
      this.$router.replace({path: this.$route.path, query: {}, hash: location.hash})
      if(this.$map.getFilter('events-circles')) {
        this.$layerManager.styleCircleSelection(this.$map.getFilter('events-circles')[2][1])
      } else {
        this.$layerManager.clearCircleFeatureStyling()
      }
      if (this.getOrientation() === "portrait") {
        EventBus.$emit("force-info-close")
      }
    },
    clearSearch() {
      this.searchResults = []
      this.$store.commit('setSearchText', '')
      this.$layerManager.clearCircleFeatureStyling()
    },
    getOrientation,
    loadEvent(id) {
      baserowApi.getEvent(id).then((resp) => {
        this.selectedDat = [resp.data];
        this.results = [resp.data];
        this.loading = false;
      }).catch((err) => {
        console.error(err);
        this.selectedDat = [];
        this.results = [];
        this.loading = false;
      });
    },
    panelDisplay() {
      if(this.selectedDat.length > 0) {
        return 'event'
      } else if(this.results.length > 0) {
        return 'results'
      } else if(this.searchResults.length > 0){
        return 'searchResults'
      } else {
        return 'intro'
      }
    },
    search(text) {
      if (!text) return;
      this.$store.commit('setSearchLoading', true)
      baserowApi.searchEvents(text).then((resp) => {
        this.results = []
        this.resultsType = 'search'
        this.setData(resp.data.results)
        if(this.searchResults.length > 0) {
          this.$store.commit('setSearchInputColor', 'white')
          this.$layerManager.clearCircleFeatureStyling()
          this.$layerManager.filterResults(this.searchResults.map((r) => {return r.id;}))
          this.zoomToSearchResults()
        } else {
          this.$layerManager.clearCircleFeatureStyling()
          this.$store.commit('setSearchInputColor', 'red')
        }
        this.$store.commit('setSearchLoading', false)
      }).catch((err) => {
        console.error(err);
        this.selectedDat = [];
        this.results = [];
        this.$store.commit('setSearchLoading', false)
      });
    },
    selectResult(_id) {
      let self = this;
      this.loading = true;
      let results = this.results.length > 0 ? this.results : this.searchResults
      const datId = results.filter((d) => d.id === _id)[0].id;
      this.$store.commit("setSelectedEventId", datId);
      this.$router.replace({path: this.$route.path, query: {event: datId}, hash: location.hash})
      this.$nextTick(() => {
        self.$layerManager.styleCircleSelection([this.$store.getters.getSelectedEventId]);
      });
      this.loadEvent(datId)
    },
    setData(dat) {
      if(this.resultsType === 'search') {
        this.searchResults = (dat.length > 1) ? dat.sort((a, b) => (b.year - a.year || b.month - a.month || b.day - a.day)) : dat
      } else {
        this.results = (dat.length > 1) ? dat.sort((a, b) => (b.year - a.year || b.month - a.month || b.day - a.day)) : dat
        if (dat.length === 1) {
          this.selectResult(dat[0].id);
        }
      }
      this.loading = false;
      if (dat.length > 0) {
        EventBus.$emit("force-info-open");
      }
    },
    zoomTo(event) {
      this.$map.flyTo({
        center: [event.lng, event.lat],
        zoom: 9,
        essential: true,
      });
    },
    zoomToSearchResults() {
      let lngs = this.searchResults.map((result) => { return +(result.longitude.substring(0,15)) })
      let lats = this.searchResults.map((result) => { return +(result.latitude.substring(0,15)) })
      let bounds = [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]]

      if(lngs.length === 1 && lats.length === 1) {
        this.$map.flyTo({
          center: [lngs[0], lats[0]],
          zoom: 7,
          essential: true,
        });
      } else {
        this.$map.fitBounds(bounds, {
          padding: { top: 75, bottom: 75, left: 200, right: 75 },
          linear: true
        })
      }
    },
  },
};
</script>

<style lang="scss">
.panel-toggle {
  position: absolute;
  right: 100%;
}
.close-btn {
  cursor: pointer;
  right: 10px;
  color: white;
  text-align: right;
  clear: both;
}
#info-panel {
  position: absolute;
  right: 0;
  top: 0px;
  width: 25%;
  overflow-y: auto;
  bottom: 37px;
  padding: 10px 15px 15px;
  background: black;
  color: white;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 300;
  margin: 0px !important;
  p {
    word-break: break-word;
    margin-bottom: 16px;
  }
  .list-title {
    font-family: "ZillaSlab";
    margin-right: 5px;
    font-size: 16px;
    font-weight: bold;
  }
  a {
    color: white;
  }
  .hidden {
    display: none;
  }
  .popup-title {
    font-family: "ZillaSlab";
    border-bottom: 1px solid black;
    padding-bottom: 8px;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 2em;
  }
  .side-loading {
    width: 100%;
    .v-progress-circular {
      margin: 0 auto;
      display: block;
    }
  }
}
#column {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 89vh 4vh;
  grid-auto-flow: column;
  grid-column-gap: 0px;
  grid-row-gap: 5px;
}
#results {
  overflow: auto;
}
</style>
