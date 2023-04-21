import { createStore } from 'vuex';
import MobileDetect from 'mobile-detect';

// TODO: Convert any $emits and $ons that can to state and Investigate store modules
export default createStore({
  state: {
    selectedLngLat: [],
    mobile: false,
    selectedEventId: -1,
    infoPanelExpanded: false,
    searchInputColor: 'white',
    searchLoading: false,
    searchText: '',
    advancedSearchExpanded: false,
    filtersActive: false,
    navMenuExpanded: false,
    featureCollection: {
      'type': 'FeatureCollection',
      'features': []
    },
    tags: {
      people: [],
      organisations: [],
      topics: [],
      countries: []
    }
  },
  mutations: {
    resetSelection(state) { state.selectedLngLat = [] },
    setFiltersActive(state, val) { state.filtersActive = val },
    setSearchInputColor(state, val) { state.searchInputColor = val },
    setSearchLoading(state, val) { state.searchLoading = val },
    setSearchText(state, val) { state.searchText = val },
    setSelectedEventId(state, val) { state.selectedEventId = val },
    setSelectedLngLat(state, val) { state.selectedLngLat = val },
    setInfoPanelExpanded(state, val) { state.infoPanelExpanded = val },
    setNavMenuExpanded(state, val) { state.navMenuExpanded = val },
    setAdvancedSearchExpanded(state, val) { state.advancedSearchExpanded = val },

    setMobile(state) {
      let md = new MobileDetect(window.navigator.userAgent);
      if (md.mobile()) state.mobile = true;
      state.mobile = window.innerWidth < 800;
    },
    pushTagsToCategory(state, { category, tags }) {
      state.tags[category].push(...tags)
    },
    pushFeatureToCollection(state, val) {
      state.featureCollection.features.push(val);
    }
  },
  actions: {
    toggleAdvancedSearchExpanded({commit, state}) {
      commit('setAdvancedSearchExpanded', !state.advancedSearchExpanded)
    }
  },
  getters: {
    getFiltersActive(state) { return state.filtersActive },
    getSearchInputColor(state) { return state.searchInputColor },
    getSearchLoading(state) { return state.searchLoading },
    getSearchText(state) { return state.searchText },
    getAdvancedSearchExpanded(state) { return state.advancedSearchExpanded },
    getInfoPanelExpanded(state) { return state.infoPanelExpanded },
    getNavMenuExpanded(state) { return state.navMenuExpanded },
    getSelectedEventId(state) { return state.selectedEventId },
    getSelectedLngLat: function (state) { return state.selectedLngLat },
    getFeatureCollection(state) { return state.featureCollection },
    getCategoryTags: (state) => (category) => { return state.tags[category] },
    isMobile: function (state) { return state.mobile }
  },
  modules: {}
});
