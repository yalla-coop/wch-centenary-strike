import { createStore } from 'vuex';
import MobileDetect from 'mobile-detect';

const Store = createStore({
  state() {
    return {
      selectedLngLat: [],
      mobile: false,
      selectedEventId: -1,
      infoPanelExpanded: false,
      navMenuExpanded: false,
    }
  },
  mutations: {
    resetSelection(state) {
      state.selectedLngLat = [];
    },
    setSelectedEventId(state, val) {
      state.selectedEventId = val;
    },
    setSelectedLngLat(state, val) {
      state.selectedLngLat = val;
    },
    setMobile(state) {
      let md = new MobileDetect(window.navigator.userAgent);
      if (md.mobile()) state.mobile = true;
      state.mobile = window.innerWidth < 800;
    },
    setInfoPanelExpanded(state, val) {
      state.infoPanelExpanded = val;
    },
    setNavMenuExpanded(state, val) {
      state.navMenuExpanded = val;
    }
  },
  getters: {
    getInfoPanelExpanded(state) {
      return state.infoPanelExpanded;
    },
    getNavMenuExpanded(state) {
      return state.navMenuExpanded;
    },
    getSelectedEventId(state) {
      return state.selectedEventId;
    },
    getSelectedLngLat: function (state) {
      return state.selectedLngLat;
    },
    isMobile: function (state) {
      return state.mobile;
    }
  },
  modules: {}
});

export default Store;
