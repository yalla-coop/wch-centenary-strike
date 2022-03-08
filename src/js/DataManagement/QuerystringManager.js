import Vue from 'vue';
import VueRouter from 'vue-router';

export default class QuerystringManager {
	constructor() {
		Vue.use(VueRouter)
		this._vue = new Vue({
			router: new VueRouter({
				mode: 'history'
			})
		});
		this.router = this._vue.$router;
		this.route = this._vue.$route;
	}

	addQueryParam(key, value) {
		if(!key || !value) return;
		let query = {
			...this._vue.$route.query
		};

		query[key] = value;

		this._vue.$router.replace({
			query,
			hash: window.location.hash
		}).catch(err => {
			// Ignore the vuex err regarding  navigating to the page they are already on.
			if (
				err.name !== 'NavigationDuplicated' &&
				!err.message.includes('Avoided redundant navigation to current location')
			) {
				// But print any other errors to the console
				console.error(err);
			}
		});

	}


	removeQueryParam(key) {
		let query = {
			...this._vue.$route.query
		};

		delete query[key];

		this._vue.$router.replace({
			query,
			hash: window.location.hash
		}).catch(err => {
			// Ignore the vuex err regarding  navigating to the page they are already on.
			if (
				err.name !== 'NavigationDuplicated' &&
				!err.message.includes('Avoided redundant navigation to current location')
			) {
				// But print any other errors to the console
				console.error(err);
			}
		});
	}
}