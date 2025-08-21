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
        v-for="item in legendItems"
        :key="item.display"
      >
        <span class="legend-item" :style="item.css"></span>{{ item.text }}
      </li>
    </ul>
    <!-- Removed Native Lands section per client requirements -->
  </v-card>
</template>

<script>
import mainConfig from '../config/mainConfig.json';
export default {
  // eslint-disable-next-line
  name: "Legend",
  props: ['layerManager', 'store'],
  data: function () {
    return {
      toggledLayer: "",
    };
  },
  computed: {
    legendItems: function () {
      return mainConfig['legend-items']
    },
    legendVisible() {
      return !(window.innerHeight > window.innerWidth && this.store.getters.getInfoPanelExpanded);
    },
  },
  methods: {
    // Removed toggleNativeLands method since Native Lands button is removed
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
  z-index: 9;
  border: none;
  border-radius: 0 !important;
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
  padding: 0 5px;
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