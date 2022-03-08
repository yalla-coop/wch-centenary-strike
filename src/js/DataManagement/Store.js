// import {
//   createStore
// } from 'vuex';
import Vuex from 'vuex';
import Vue from 'vue';
import MobileDetect from 'mobile-detect';
// import qs from "query-string";


Vue.use(Vuex);

const Store = new Vuex.Store({
  state: () => ({
    selectedLngLat: [],
    mobile: false
  }),
  mutations: {
    resetSelection: function (state) {
      state.selectedLngLat = [];
    },
    setSelectedLngLat: function (state, val) {
      state.selectedLngLat = val;
    },
    setMobile: function(state){
      let md = new MobileDetect(window.navigator.userAgent);
      if (md.mobile()) state.mobile = true;
      state.mobile = window.innerWidth < 800;
     // state.mobile = val;
    }
  },
  getters: {
    getSelectedLngLat: function (state) {
      return state.selectedLngLat;
    },
    isMobile:function(state){
      return state.mobile;
    }
  },
  modules: {}
});

export default Store;
