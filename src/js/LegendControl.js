
import Legend from '../components/Legend.vue';
import Store from './DataManagement/Store';
import Vue from 'vue';
import vuetify from 'vuetify';
import Vuetify from 'vuetify/lib';
export default class LegendControl {
    constructor() {
        this._vue = new Vue();
        Vue.use(vuetify);
    }
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl legend-control-container';

        var ComponentClass = Vue.extend(Legend);
        var instance = new ComponentClass({store:Store, vuetify: new Vuetify()});
        console.log(instance)
        instance.$mount();
       
        this._container.appendChild(instance.$el);
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}