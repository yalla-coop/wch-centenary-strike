<template>
  <v-card
    dense
    dark
    elevation="2"
    v-show="legendVisible"
    class="legend-container"
  >
    <v-card-title dense>Legend</v-card-title>
    <v-divider></v-divider>
    <ul class="legend-list">
      <li
        class="list-item"
        v-for="item in this.$mainConfig['legend-items']"
        :key="item.display"
      >
        <span class="legend-item" :style="item.css"></span>{{ item.text }}
      </li>
    </ul>
    <v-divider></v-divider>
    <v-card-text>
      Additional Layers:
      <br />
      <i>(click to activate)</i>
      <v-chip-group
        v-model="toggledLayer"
        active-class="blue accent-4 white--text"
        column
      >
        <v-chip
          filter
          v-for="layer in legendLayers"
          @click="toggleLayer(layer)"
          :key="layer['layer-id']"
        >
          {{ layer["legend-display"] }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Legend",
  data: function () {
    return {
      toggledLayer: ""
    };
  },
  mounted() {
    this.mobileOnMounted = window.innerHeight > window.innerWidth;
  },
  computed: {
    legendLayers: function () {
      return this.$mainConfig["toggleable-layers"];
    },
    legendVisible() {
     
      if (
        window.innerHeight > window.innerWidth &&
        this.$store.getters.getInfoPanelExpanded
      ) {
        return false;
      }
      return true;
    },
  },
  methods: {
    toggleLayer: function (_layer) {
      if (_layer) {
        this.$layerManager.toggleLayer(_layer["layer-id"]);
        if (_layer.labels) {
          this.$layerManager.toggleLayer(_layer["layer-id"] + "-labels");
        }
      }
    },
  },
};
</script>

<style>
.legend-item {
  display: inline-block;
  margin: 0 5px;
}
.list-item {
  padding: 5px;
  margin-bottom: 5px;
}
.legend-container {
  /* width: 8%; */
  /* margin: 10px; */
  z-index: 9;
  border: 1px solid white !important;
}
.legend-list {
  list-style: none;
  padding: 0 5px;
  padding-left: 0px !important;
}

.legend-container .v-card__title {
  background: yellow;
  color: black;
  padding: 0 5%;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 5px;
}

.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl {
  margin: 0 0 10px 5px;
}
</style>