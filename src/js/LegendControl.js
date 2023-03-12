
import Legend from '../components/Legend.vue';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
export default class LegendControl {
    constructor(globalProps) {
        this.globalProps = globalProps
        this.vuetify = createVuetify({components, directives})
    }
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl legend-control-container';
        this.app = createApp(Legend, {layerManager: this.globalProps.$layerManager, store: this.globalProps.$store})
        this.app.use(this.vuetify)
        this.app.mount(this._container);
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
