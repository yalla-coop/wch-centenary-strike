<template>
  <v-card
    dense
    theme="dark"
    elevation="2"
    rounded="false"
    v-show="legendVisible"
    class="legend-container"
  >
    <v-card-title class="legend-title" dense>Legend</v-card-title>
    <v-divider></v-divider>
    <ul class="legend-list">
      <li
        class="list-item"
        v-for="item in filteredLegendItems"
        :key="item.display"
      >
        <span class="legend-item" :style="item.css"></span>{{ item.text }}
      </li>
    </ul>
  </v-card>
</template>

<script>
import mainConfig from '../config/mainConfig.json';
import { EventBus } from "../js/DataManagement/EventBus";

export default {
  // eslint-disable-next-line
  name: "Legend",
  props: ['layerManager', 'store'],
  data: function () {
    return {
      toggledLayer: "",
      mapData: [], // Store the current map data
    };
  },
  mounted() {
    // Listen for data updates from the map
    EventBus.$on('map-data-updated', (data) => {
      console.log('Legend received data via EventBus - updating immediately');
      this.mapData = data;
      // Force immediate reactivity update
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    });
    
    // Listen for layer changes that might affect what's visible
    EventBus.$on('layer-visibility-changed', () => {
      this.$forceUpdate();
    });

    // Try to get data more aggressively at shorter intervals
    setTimeout(() => this.tryToGetMapData(), 1000);
    setTimeout(() => this.tryToGetMapData(), 2000);
    setTimeout(() => this.tryToGetMapData(), 3000);
    setTimeout(() => this.tryToGetMapData(), 5000);
  },
  beforeUnmount() {
    EventBus.$off('map-data-updated');
    EventBus.$off('layer-visibility-changed');
  },
  computed: {
    allLegendItems: function () {
      return mainConfig['legend-items'] || [];
    },
    filteredLegendItems: function () {
      // Always try to get fresh data first
      if ((!this.mapData || !Array.isArray(this.mapData) || this.mapData.length === 0)) {
        // Try to get data directly if we don't have any
        this.tryToGetMapData();
        
        // If still no data, show all legend items as fallback
        if (!this.mapData || !Array.isArray(this.mapData) || this.mapData.length === 0) {
          return this.allLegendItems;
        }
      }
      
      // Get the categories/types that are actually present in the data
      const presentCategories = this.getPresentCategories();
      
      // If no categories found, show all items (safety fallback)
      if (presentCategories.size === 0) {
        return this.allLegendItems;
      }
      
      // Filter legend items to only show those with matching categories
      const filtered = this.allLegendItems.filter(item => {
        return this.isLegendItemPresent(item, presentCategories);
      });
      
      // If no items would be shown, show all as fallback
      if (filtered.length === 0) {
        return this.allLegendItems;
      }
      
      return filtered;
    },
    legendVisible() {
      const visible = !(window.innerHeight > window.innerWidth && this.store.getters.getInfoPanelExpanded);
      // Debug logging
      console.log('Legend visible:', visible, 'Items count:', this.filteredLegendItems.length, 'MapData length:', this.mapData ? this.mapData.length : 0);
      return visible;
    },
  },
  methods: {
    getPresentCategories() {
      const categories = new Set();
      
      if (!this.mapData || !Array.isArray(this.mapData)) {
        return categories;
      }
      
      this.mapData.forEach(item => {
        // Check for the actual field name in your data: 'geotag' 
        const locationPrecision = item.geotag;
        
        if (locationPrecision) {
          categories.add(locationPrecision);
        }
      });
      
      return categories;
    },
    
    isLegendItemPresent(legendItem, presentCategories) {
      // Map the legend display values to the actual geotag values in your data
      const legendToDataMapping = {
        'place-to-visit': 'place_to_visit',
        'exact-location': 'exact_location', 
        'near-here': 'near_here',
        'in-this-town-city': 'in_this_town_city'
      };
      
      // Get the corresponding data category for this legend item
      const dataCategory = legendToDataMapping[legendItem.display];
      
      // Check if this category is present in the actual map data
      return dataCategory && presentCategories.has(dataCategory);
    },
    
    // Method to update data when map data changes
    updateMapData(newData) {
      this.mapData = newData;
    },

    // Try to get data from various sources
    tryToGetMapData() {
      console.log('tryToGetMapData called');
      
      // Don't run if we already have data
      if (this.mapData && this.mapData.length > 0) {
        console.log('Already have data, skipping');
        return;
      }

      try {
        // Method 1: Try to access the map through multiple possible paths
        let map = null;
        
        // Try different ways to access the map
        if (this.$.appContext?.app?.config?.globalProperties?.$map) {
          map = this.$.appContext.app.config.globalProperties.$map;
          console.log('Found map via globalProperties');
        } else if (window.$map) {
          map = window.$map;
          console.log('Found map via window');
        } else if (this.$parent && this.$parent.$parent && this.$parent.$parent.map) {
          map = this.$parent.$parent.map;
          console.log('Found map via parent component');
        }

        if (!map) {
          console.log('No map found through any method');
          return;
        }

        console.log('Map found, looking for sources');
        
        // List all available sources
        const sources = map.getStyle()?.sources;
        if (sources) {
          console.log('Available map sources:', Object.keys(sources));
        }

        // Try to get data from the events-source
        const eventsSource = map.getSource('events-source');
        if (eventsSource) {
          console.log('Found events-source:', eventsSource);
          
          if (eventsSource._data && eventsSource._data.features) {
            console.log('Found events-source with features:', eventsSource._data.features.length);
            const data = eventsSource._data.features.map(f => f.properties);
            if (data.length > 0) {
              console.log('Setting mapData from events-source - triggering immediate update');
              this.mapData = data;
              // Force immediate Vue reactivity
              this.$nextTick(() => {
                this.$forceUpdate();
              });
              return;
            }
          } else {
            console.log('events-source exists but has no _data or features yet');
          }
        } else {
          console.log('No events-source found');
        }

      } catch (error) {
        console.error('Error trying to get map data:', error);
      }
    }
  },
};
</script>

<style lang="scss">
.legend-item {
  display: inline-block;
  margin: 0 5px;
}
.list-item {
  padding: 5px;
  margin-bottom: 5px;
}
.legend-container {
  z-index: 1000;
  border: none;
  border-radius: 0 !important;
  min-width: 200px;
  width: 200px;
  .v-card-title {
    background: #DF6E4B;
    color: black;
    padding: 0 5%;
    padding-left: 12px;
    font-weight: bold;
    text-align: left;
    display: inline-block;
    width: 100%;
  }
  .v-chip.v-theme--dark {
    &:not(.v-chip--selected) {
      background: #555;
    }
  }
  .v-chip.v-theme--dark.v-chip--selected {
    background-color: #2962ff;
    border-color: #2962ff;
  }
}
.legend-list {
  list-style: none;
  padding: 0 10px;
  padding-left: 0px !important;
}
.mapboxgl-ctrl-bottom-left {
  .mapboxgl-ctrl {
    margin: 0 0 10px 5px;
  }
}
.legend-title {
  font-family: var(--font-primary, "Inter", "Helvetica Neue", Arial, sans-serif) !important;
  text-transform: initial;
  color: #FCFAFA !important;
}
.legend-note {
  text-align: center;
  margin: 0 auto;
  font-size: 12px;
  a {
    color: gray;
  }
}
</style>