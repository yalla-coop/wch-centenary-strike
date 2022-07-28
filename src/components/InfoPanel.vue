<template>
  <div id="info-panel">
    <div :class="dat.length > 0 ? 'hidden' : ''">
      <h3 style="font-family: 'ZillaSlab'; font-size: 24px">
        Working Class History | Map
      </h3>
      <br>
      <p>
        History isn't made by kings and politicians, it is made by us: billions
        of ordinary people. This is a map containing our historical stories of
        our collective struggles to build a better world.
      </p>

      <p>
        Here you can browse stories geographically, and you can click through to
        our
        <a href="https://working-class-history.netlify.app/">Stories app</a> to
        see more information like sources for each story. Our work is funded
        entirely by our readers and listeners on patreon, so if you value our
        work please consider
        <a href="https://patreon.com/workingclasshistory">supporting us.</a>
      </p>
    </div>
    <div :class="dat.length > 0 ? '' : 'hidden'">
      <div @click="selectDat(null)" class="close-btn">
        <v-icon dark class="close-btn">mdi-close</v-icon>
      </div>
      <v-card class="mx-auto" max-width="300" tile v-if="dat.length > 1">
        <h3
          :style="{
            'text-align': 'center',
            'font-family': 'ZillaSlab',
            background: this.$styleConfig.colors.yellow.primary,
            padding: '5px',
          }"
        >
          Events near here
        </h3>

        <v-list style="font-family: 'Roboto'" dense>
          <span style="padding: 10px">Select one:</span>
          <v-divider></v-divider>
          <v-list-item-group color="primary">
            <v-list-item v-for="(d, i) in dat" :key="i">
              <v-list-item-content @click="selectDat(d.name)">
                <v-list-item-title style="font-weight: bold" v-text="d.title">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <!-- <ul v-if="dat.length > 1">
        <li v-for="d in dat" :key="d.name">
          <a @click="selectDat(d.name)">{{ d.title }}</a>
        </li>
      </ul> -->
      <div v-if="selectedDat.length > 0 && dat.length === 1">
        <h3 class="info-title popup-title">{{ selectedDat[0].title }}</h3>
        <br />
        <v-divider></v-divider>
        <br />
        <p class="info-description" v-html="selectedDat[0].description"></p>

        <div
          :class="
            selectedDat[0].media
              ? 'media-container info-photo'
              : 'hidden info-photo'
          "
        >
          <div class="img-container">
            <img :src="selectedDat[0].media" />
          </div>
          <p class="img-caption">{{ selectedDat[0].media_caption }}</p>
          <p class="img-caption">{{ selectedDat[0].media_credit }}</p>
        </div>
        <!-- //HC -->
        <v-divider></v-divider>
        <div>
          {{ selectedDat[0].geotag_info }}:
          {{ selectedDat[0].geotag_description }}
        </div>
        <div v-show="selectedDat[0].visitor_info.length > 0">
          {{ selectedDat[0].visitor_info }}
        </div>
        <v-divider></v-divider>
        <ul class="info-list">
          <li
            class="info-author"
            v-show="selectedDat[0].author_name.length > 0"
          >
            <span class="list-title">Author:</span>
            <a :href="selectedDat[0].author_url" target="_blank">{{
              selectedDat[0].author_name
            }}</a>
          </li>
          <li class="info-learn">
         
            <a
              :href="`${this.$baseurl}/article/${
                selectedDat[0].id
              }/${selectedDat[0].title.replaceAll(' ', '-')}`"
              target="_blank"
              >Learn More</a
            >
          </li>
          <li class="info-merch" v-show="selectedDat[0].merch_url.length > 0">
            <a :href="selectedDat[0].merch_url" target="_blank"
              >Related Merch</a
            >
          </li>
          <li
            class="info-podcast"
            v-show="selectedDat[0].podcast_url.length > 0"
          >
            <a :href="selectedDat[0].podcast_url" target="_blank"
              >Related Podcast</a
            >
          </li>
          <li class="info-book" v-show="selectedDat[0].books_url.length > 0">
            <a :href="selectedDat[0].books_url" target="_blank"
              >Related Books</a
            >
          </li>
          <li
            class="info-googlemaps"
            v-show="
              selectedDat[0].latitude.length > 0 &&
              selectedDat[0].longitude.length > 0
            "
          >
            <a
              target="_blank"
              :href="`https://maps.google.com?q=${selectedDat[0].latitude},${selectedDat[0].longitude}`"
              >Open in Google Maps</a
            >
          </li>
        </ul>
        <div class="zoom-to">
          <a
            @click="
              zoomTo({
                lat: selectedDat[0].latitude,
                lng: selectedDat[0].longitude,
              })
            "
            href="#"
            ><v-icon dark>mdi-magnify</v-icon
            ><span class="list-title">Zoom To</span></a
          >
        </div>
      </div>
      <div v-if="loading" class="side-loading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { EventBus } from "../js/DataManagement/EventBus";
export default {
  name: "InfoPanel",
  data: function () {
    return {
      dat: [],
      selectedDat: [],
      loading: true,
    };
  },
  mounted: function () {
    let self = this;
    EventBus.$on("clear-event", () => self.selectDat(null));
    //TODO: This is redundant with code for handling clicks
    EventBus.$on("select-from-url", (datId) => {
      axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/${self.$mainConfig.api.baserow.tables.main}/${datId}/?user_field_names=true`,
        headers: {
          Authorization: `Token ${self.$mainConfig.api.keys.baserow}`,
        },
      })
        .then((resp) => {
          // console.log(resp.data);
          self.selectedDat = [resp.data];
          self.dat = [resp.data];
          self.loading = false;
        })
        .catch((err) => {
          console.error(err);
          self.selectedDat = [];
          self.dat = [];
          self.loading = false;
        });
    });
  },
  methods: {
    setData(dat) {
      this.dat = dat;
      //document.getElementById('main-map').classList.add("selection-made");
      this.loading = false;
      if (dat.length === 1) {
        this.selectDat(dat[0].name);
      }
      if (dat.length > 0) {
        EventBus.$emit("force-info-open");
      }
    },
    selectDat(_name) {
      let self = this;
      if (!_name) {
        this.selectedDat = [];
        this.dat = [];
        this.$store.commit("setSelectedEventId", -1);
        this.$layerManager.styleCircleSelection();
        if (this.getOrientation() === "portrait") {
          EventBus.$emit("force-info-close");
        }

        return;
      }
      this.loading = true;
      const datId = this.dat.filter((d) => d.name === _name)[0].name;
      this.$store.commit("setSelectedEventId", datId);
      // let self = this;
      this.$nextTick(() => {
        self.$layerManager.styleCircleSelection();
      });
      axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/${this.$mainConfig.api.baserow.tables.main}/${datId}/?user_field_names=true`,
        headers: {
          Authorization: `Token ${this.$mainConfig.api.keys.baserow}`,
        },
      })
        .then((resp) => {
          // console.log(resp.data);
          this.selectedDat = [resp.data];
          this.dat = [resp.data];
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.selectedDat = [];
          this.dat = [];
          this.loading = false;
        });
    },
    zoomTo(entry) {
      this.$map.flyTo({
        center: [entry.lng, entry.lat],
        zoom: 9,
        essential: true,
      });
    },
  },
};
</script>

<style>
.panel-toggle {
  position: absolute;
  right: 100%;
}
.close-btn {
  cursor: pointer;
  /* position: absolute; */
  right: 10px;
  color: white;
  text-align: right;
  clear: both;
}
#info-panel .v-list-item__content {
  border-bottom: 1px solid #d1d0d0;
}
#info-panel {
  /* font-family: "Avenir Heavy"; */

  position: absolute;
  /* z-index: 0; */
  right: 0;
  top: 0px;
  width: 25%;
  /* max-width: 40%; */
  overflow-y: auto;
  bottom: 37px;
  padding: 15px;
  background: black;
  color: white;
  font-family: Roboto, sans-serif;
  font-size: 14px;

  font-weight: 300;
  margin: 0px !important;
}

#info-panel p {
  word-break: break-word;
}
#info-panel .list-title {
  font-family: "ZillaSlab";
  margin-right: 5px;
  font-size: 16px;
  font-weight: bold;
}

#info-panel a {
  color: white;
}
#info-panel .hidden {
  display: none;
}
#info-panel .img-caption {
  margin-bottom: 0;
  text-align: left;
  font-size: 0.85em;
}
.img-container {
  width: 100%;
}

.img-container img {
  max-width: 90%;
  display: block;
  margin-left: 0;
}

#info-panel .media-container {
  margin: 10px;
  margin-left: 0;
}

#info-panel .zoom-to {
  display: block;
  font-size: 15px;
  position: relative;

  /* right: 10px; */
  width: 100%;
  text-align: right;
  bottom: 13px;
  pointer-events: none;
  margin-top: 2em;
}

#info-panel .zoom-to a {
  pointer-events: all;
  text-decoration: none;
  margin-top: 20px;
}

#info-panel .popup-title {
  font-family: "ZillaSlab";
  border-bottom: 1px solid black;
  padding-bottom: 8px;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 2em;
}

#info-panel .side-loading {
  width: 100%;
}
#info-panel .side-loading .v-progress-circular {
  margin: 0 auto;
  display: block;
}

#info-panel .info-list {
  margin-top: 15px;
}
</style>