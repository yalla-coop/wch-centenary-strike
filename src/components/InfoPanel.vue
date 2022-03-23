<template>
  <div id="info-panel">
    
    <div :class="dat.length > 0 ? 'hidden' : ''">
      <h3>Information about project here...</h3>
      History is not made by the actions of a few rich and powerful individuals,
      like so much of the history we learn in school. History is made by the
      combined everyday actions of hundreds of millions of us: women, men,
      youth, people of colour, migrants, Indigenous people, LGBT+ people,
      disabled people, workers, older people, the unemployed, housewives – the
      working class. It is our struggles which have shaped our world, and any
      improvement in our conditions has been won by years of often violent
      conflict and sacrifice. This project is dedicated to all those who have
      struggled in the past for a better world, and who continue to do so now.
      To help record and popularise our grassroots, people’s history, as opposed
      to the top-down accounts of most history books.
    </div>
    <div :class="dat.length > 0 ? '' : 'hidden'">
      <div @click="selectDat(null)" class="close-btn">
        <v-icon class="close-btn">mdi-close</v-icon>
      </div>
      <v-card class="mx-auto" max-width="300" tile v-if="dat.length > 1">
        <h3 style="text-align: center; background: #ffeb3b; padding: 5px">
          Events Near Here
        </h3>

        <v-list dense>
          <i style="padding: 10px">Select One:</i>
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
        <h3 class="popup-title">{{ selectedDat[0].title }}</h3>
        <h4>({{ selectedDat[0].geotag_info }})</h4>
        <h4 v-show="selectedDat[0].visitor_info.length > 0">
          {{ selectedDat[0].visitor_info }}
        </h4>
        <br />
        <v-divider></v-divider>
        <br />
        <p>{{ selectedDat[0].description }}</p>

        <div :class="selectedDat[0].media ? 'media-container' : 'hidden'">
          <p class="img-caption">{{ selectedDat[0].media_caption }}</p>
          <p class="img-caption">{{ selectedDat[0].media_credit }}</p>

          <div class="img-container">
            <img :src="selectedDat[0].media" />
          </div>
        </div>
        <!-- //HC -->
        <v-divider></v-divider>
        <ul>
          <li v-show="selectedDat[0].author_name.length > 0">
            <a :href="selectedDat[0].author_url" target="_blank"
              >Author: {{ selectedDat[0].author_name }}</a
            >
          </li>
          <li v-show="selectedDat[0].merch_url.length > 0">
            <a :href="selectedDat[0].merch_url" target="_blank"
              >Related Merch</a
            >
          </li>
          <li v-show="selectedDat[0].podcast_url.length > 0">
            <a :href="selectedDat[0].podcast_url" target="_blank"
              >Related Podcast</a
            >
          </li>
          <li v-show="selectedDat[0].books_url.length > 0">
            <a :href="selectedDat[0].books_url" target="_blank"
              >Related Books</a
            >
          </li>
          <li
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
    <div  class="zoom-to">
        <a
          @click="
            zoomTo({
              lat: selectedDat[0].latitude,
              lng: selectedDat[0].longitude,
            })
          "
          href="#"
         
          ><v-icon>mdi-magnify</v-icon>Zoom To</a
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
export default {
  name: "InfoPanel",
  data: function () {
    return {
      dat: [],
      selectedDat: [],
      loading: true,
    };
  },
  mounted: function () {},
  methods: {
    setData(dat) {
      this.dat = dat;
      //document.getElementById('main-map').classList.add("selection-made");
      this.loading = false;
      if (dat.length === 1) {
        this.selectDat(dat[0].name);
      }
    },
    selectDat(_name) {
      if (!_name) {
        this.selectedDat = [];
        this.dat = [];
        return;
      }
      this.loading = true;
      const datId = this.dat.filter((d) => d.name === _name)[0].name;
      axios({
        method: "GET",
        url: `https://api.baserow.io/api/database/rows/table/${this.$mainConfig.api.baserow.tables.main}/${datId}/?user_field_names=true`,
        headers: {
          Authorization: `Token ${this.$mainConfig.api.keys.baserow}`,
        },
      })
        .then((resp) => {
          console.log(resp.data);
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
.panel-toggle{
  position: absolute;
    left: 100%;
}
.close-btn {
  cursor: pointer;
  position: absolute;
  right: 10px;
}
#info-panel .v-list-item__content {
  border-bottom: 1px solid #d1d0d0;
}
#info-panel {
  overflow-y: scroll;
  /* font-family: "Avenir Heavy"; */
  font-size: 12px;
  position: absolute;
  /* z-index: 0; */
  left: 0;
  top: 64px;
  width: 25%;
  /* max-width: 40%; */
  overflow-y: scroll;
  bottom: 37px;
  padding: 10px;
  background: white;
}

#info-panel .hidden {
  display: none;
}
#info-panel .img-caption {
  font-style: italic;
  margin-bottom: 0;
}
.img-container {
  width: 100%;
}

.img-container img {
  max-width: 90%;
  margin: 0 auto;
  display: block;
}

#info-panel .media-container{
    margin: 10px;
}

#info-panel .zoom-to{
display: block;
    font-size: 15px;
    position: relative;
    
    /* right: 10px; */
    width: 100%;
    text-align: right;
    bottom: 13px;
    pointer-events: none;
}

#info-panel .zoom-to a{
    pointer-events: all;
    text-decoration: none;
}

#info-panel .popup-title {
  border-bottom: 1px solid black;
  padding-bottom: 8px;
  margin-bottom: 8px;
  font-weight: bold;
}

#info-panel .side-loading {
  width: 100%;
}
#info-panel .side-loading .v-progress-circular {
  margin: 0 auto;
  display: block;
}


</style>