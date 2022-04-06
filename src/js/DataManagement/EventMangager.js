import {
	EventBus
} from "./EventBus";

import Vue from 'vue';
import Store from "./Store";
//import $ from "jquery";
export default class EventManager {
	constructor() {
		this._vue = new Vue({
			store: Store
		});

		this.proposalNames = {}

		EventBus.$on("select-item-from-url", this.selectFromUrl.bind(this));

		let self = this;
		this._vue.$map.once('idle', () => {
			EventBus.$on("select-from-address-search", self.selectFromAddressSearch.bind(self));
			EventBus.$on("select-from-district-search", self.selectFromDistrictSearch.bind(self));
			EventBus.$on("select-from-click", self.selectFromClick.bind(self));
			EventBus.$on("select-from-type-switch", self.selectFromTypeSwitch.bind(self));
			EventBus.$on("select-from-proposal-switch", self.selectFromProposalSwitch.bind(self));
			EventBus.$on('check-for-url-event', self.checkURL.bind(self));
		});
	}

	selectDistrictOnMapFromLatLng(lnglat, shouldZoom, selectionType) {
	}

	unselect() {

	}
	checkURL() {
		const params = new URLSearchParams(location.search);
		if (params.get("event")) {
			const eId = params.get("event");
			this._vue.$store.commit("setSelectedEventId", +eId);
			EventBus.$emit('select-from-url', eId);
			let self = this;
			this._vue.$nextTick(() => {
				self._vue.$layerManager.styleCircleSelection();
			});
		}
	}
	// setQueryStringParam(id){
	// 	console.log(id);

	// }

	updateMapSelection(options) {


		this._vue.$nextTick(() => {
			if (!options.lnglat[1] || !options.lnglat[0]) return;

		});
	}

	selectFromAddressSearch(lnglat) {
		console.log("select-from-address-search")
		this.selectDistrictOnMapFromLatLng(
			lnglat,
			true,
			"select-from-address-search"
		);
	}


	selectFromDistrictSearch(lnglat) {
		console.log("select-from-district-search")
		this.selectDistrictOnMapFromLatLng(
			lnglat,
			true,
			"select-from-district-search"
		);
	}

	selectFromClick(lnglat) {
		console.log("select-from-click")
		this.selectDistrictOnMapFromLatLng(lnglat, false, "select-from-click");
	}

	selectFromTypeSwitch(lnglat) {
		console.log("select-from-type-switch")
		//if (this.$dataManager.waitForUrl) return;
		this.selectDistrictOnMapFromLatLng(
			lnglat,
			false,
			"select-from-type-switch"
		);
	}

	selectFromProposalSwitch(lnglat) {
		console.log("select-from-proposal-switch")
		this.selectDistrictOnMapFromLatLng(
			lnglat,
			false,
			"select-from-proposal-switch"
		);
	}

	selectFromUrl(lnglat) {
		//console.log("select-district-from-url")
		this.selectDistrictOnMapFromLatLng(lnglat, false, "select-from-url");
	}

}
