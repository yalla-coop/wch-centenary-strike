<template>
  <div id="info-panel">
    <div id="column">
      <div id="results">
        <div v-if="panelDisplay() === 'intro'">
          <h3 style="font-family: 'ZillaSlab'; font-size: 24px">
            Working Class History | Map
          </h3>
          <br>
          <p>History isn't made by kings and politicians, it is made by us: billions of ordinary people. This is a map containing our historical stories of our collective struggles to build a better world.</p>
          <p>Welcome to the new WCH Map! On this map you can browse our historical stories geographically, and you can click "Learn more" at the bottom of each story to be taken to our new <a href="https://stories.workingclasshistory.com/">Stories app</a> to see more information like sources for each story and&nbsp;links to more information.&nbsp;</p>
          <p>We have been able to develop this Map and Stories app thanks to generous support from our <a href="https://patreon.com/workingclasshistory">backers on patreon</a>, and some fantastic people who contributed to a GoFundMe campaign. With our GoFundMe we attempted to raise $8000 to cover the cost of the development of these apps. We were able to raise approximately $3000, and so there remains a significant shortfall. We also would like to develop improved functionality for the map, including a search, and filters by topic and year. So if you can, please consider <a href="https://patreon.com/workingclasshistory">supporting us on patreon</a> or giving us a <a href="https://workingclasshistory.com/support">one-off donation</a> to help cover our costs.</p>
          <p>If you are interested in collaborating with us and contributing data for the map,&nbsp;or if you spot any errors, please email us at info@workingclasshistory.com</p>
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
              v-if="searchResults.length > 1"
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

    // Mount search control to mapbox
    let el = document.querySelector('.mapboxgl-ctrl-top-right')
    let vNode = h(SearchControl, {
      search: this.search,
      clearSearch: this.clearSearch,
      clearResults: this.clearResults}, {}
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
      EventBus.$emit('setSearchInputColor', 'white')
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
      EventBus.$emit('setSearchText', '')
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
      EventBus.$emit('setSearchLoading', true)
      baserowApi.searchEvents(text).then((resp) => {
        this.results = []
        this.resultsType = 'search'
        this.setData(resp.data.results)
        if(this.searchResults.length === 1) {
          this.$layerManager.clearCircleFeatureStyling()
          EventBus.$emit('setSearchInputColor', 'white')
          this.selectResult(this.searchResults[0].id)
        } else if(this.searchResults.length > 1) {
          EventBus.$emit('setSearchInputColor', 'white')
          this.$layerManager.clearCircleFeatureStyling()
          this.$layerManager.filterResults(this.searchResults.map((r) => {return r.id;}))
          this.zoomToResults()
        } else {
          this.$layerManager.clearCircleFeatureStyling()
          EventBus.$emit('setSearchInputColor', 'red')
        }
        EventBus.$emit('setSearchLoading', false)
      }).catch((err) => {
        console.error(err);
        this.selectedDat = [];
        this.results = [];
        EventBus.$emit('setSearchLoading', false)
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
      }
      this.loading = false;
      if (dat.length === 1) {
        this.selectResult(dat[0].id);
      }
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
    zoomToResults() {
      let lons = this.searchResults.map((result) => { return +(result.longitude.substring(0,15)) })
      let lats = this.searchResults.map((result) => { return +(result.latitude.substring(0,15)) })
      let bounds = [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]]

      this.$map.fitBounds(bounds, {
        padding: { top: 75, bottom: 75, left: 200, right: 75 },
        linear: true
      })
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
