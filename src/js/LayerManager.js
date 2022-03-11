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
    initToggledLayersFromUrl(_map) {
        const toggledLayers = this._vue.$mainConfig["toggleable-layers"];
        toggledLayers.forEach(layer => {
            this.addLayerToMap(layer);
        })
    }
    addLayerToMap(_options) {
        switch (_options.type) {
            case 'geojson-remote':
                this.addGeoJSONRemoteToMap(_options);
                break;
            case 'baserow':
                this.addBaserowToMap(_options);
                break;
            default: break;
        }
    }
    addGeoJSONRemoteToMap(_options) {
        let self = this;
        axios.get(_options.url).then(resp => {
            const _geojson = {
                type: "FeatureCollection",
                features: resp.data
            };
            const srcID = _options["layer-id"] + '-source';
            console.log(srcID)
            this._vue.$map.addSource(srcID, {
                'type': 'geojson',
                'data': _geojson
            });
            this._vue.$map.addLayer({
                'id': _options["layer-id"],
                'type': 'fill',
                'source': srcID, // reference the data source
                'layout': {},
                'paint': {
                    'fill-color': ['get', 'color'], // blue color fill
                    'fill-opacity': 0.25
                }
            });
        })
    }
    addBaserowToMap(_options) {
        axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/${_options.tableid}/?user_field_names=true${_options.sizeLimit ? '&' : ''}${_options.sizeLimit}${_options.filter ? '&' : ''}${_options.filter}`,
            headers: {
                Authorization: `Token ${this._vue.$mainConfig.api.keys.baserow}`
            }
        }).then((resp) => {
            const entries = resp.data.results;

            entries.forEach(entry => {
                const el = document.createElement('div');
                const _style = this._vue.$styleConfig.styles.marker;
                Object.assign(el.style, _style)
                const marker = new mapboxgl.Marker(el)
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