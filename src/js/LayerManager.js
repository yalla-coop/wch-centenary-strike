import Vue from 'vue'
import {
    EventBus
} from './DataManagement/EventBus';
import axios from 'axios';
import mapboxgl from "mapbox-gl";

export default class LayerManager {
    constructor() {
        this._vue = new Vue();
        this.layers = [];
        this.sources = [];
    }
    addLayerToMap(_options) {
        switch (_options.type) {
            case 'geojson':
                this.addGeoJSONToMap(_options);
                break;
            case 'baserow':
                this.addBaserowToMap(_options);
                break;
            default: break;
        }
    }

    addGeoJSONToMap(_options) { }
    addBaserowToMap(_options) {
        axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/${_options.tableid}/?user_field_names=true${_options.sizeLimit ? '&' : ''}${_options.sizeLimit}${_options.filter ? '&' : ''}${_options.filter}`,
            headers: {
                Authorization: `Token ${this._vue.$mainConfig.api.keys.baserow}`
            }
        }).then((resp) => {
            const entries = resp.data.results;
            console.log(entries[0])
            entries.forEach(entry => {
                const marker = new mapboxgl.Marker()
                    .setLngLat([entry.longitude, entry.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`
                    <h1>${entry.title}</h1>
                    <p>${entry.description}</p>
                    `))
                    .addTo(this._vue.$map);
            });
        })
    }
}