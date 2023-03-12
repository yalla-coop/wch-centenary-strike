// import Vue from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
const App = { template: '<div id="app"></div>'}

const routes = [
	{ path: '/', component: App }
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router;
