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
    <v-divider></v-divider>
    <v-card-text>
      Additional Layers
      <br />
      (click to activate):
      <v-divider></v-divider>
      <v-chip-group
        v-model="toggledLayer"
        active-class="blue accent-4 white--text"
        column
      >
        <span v-for="layer in legendLayers" :key="layer['layer-id']">
          <v-chip style="margin: 0 auto" :disabled="toggleDisabled" filter @click="toggleLayer(layer)">
            {{ layer["legend-display"] }}
          </v-chip>
          <div
            style="text-align: center; margin: 0 auto"
            v-if="layer['legend-note']"
            v-html="layer['legend-note']"
          ></div>
        </span>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script>
import mainConfig from '../config/mainConfig.json';
import { EventBus } from '../js/DataManagement/EventBus.js';
export default {
  // eslint-disable-next-line
  name: "Legend",
  props: ['layerManager', 'store'],
  data: function () {
    return {
      toggledLayer: "",
      toggleDisabled: true
    };
  },
  mounted() {
    this.mobileOnMounted = window.innerHeight > window.innerWidth;
    EventBus.$on('enable-toggled-layers', () => { this.toggleDisabled = false })
  },
  computed: {
    legendItems: function () {
      return mainConfig['legend-items']
    },
    legendLayers: function () {
      return mainConfig["toggleable-layers"];
    },
    legendVisible() {
      return !(window.innerHeight > window.innerWidth && this.store.getters.getInfoPanelExpanded);
    },
  },
  methods: {
    toggleLayer: function (_layer) {
      if (_layer) {
        this.layerManager.toggleLayer(_layer["layer-id"]);
        if (_layer.labels) {
          this.layerManager.toggleLayer(_layer["layer-id"] + "-labels");
        }
      }
    },
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
    background: #fad40a;
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
  font-family: "ZillaSlab";
  text-transform: initial;
}
</style>
