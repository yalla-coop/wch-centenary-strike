import Vue from 'vue'
import {
    EventBus
} from './DataManagement/EventBus';
import axios from 'axios';
import mapboxgl from "mapbox-gl";
import turfCentroid from '@turf/centroid'
//var turfCentroid = require('turf-centroid');

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
            //console.log(srcID)
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

            if (_options.labels) {
                var result = {
                    "type": "FeatureCollection",
                    "features": []
                };
                
                for (var i = 0; i < _geojson.features.length; i++) {
                    result.features.push(
                        {
                            "type": "Feature",
                            "properties": {"name": _geojson.features[i].properties.Name},
                            "geometry": turfCentroid(_geojson.features[i]).geometry
                        }
                    );
                }

                this._vue.$map.addSource('label-points', {
                    'type': 'geojson',
                    'data': result
                });
                
                this._vue.$map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'label-points',
                    'layout': {
                        'icon-image': 'custom-marker',
                        // get the title name from the source's "title" property
                        'text-field': ['get', 'name'],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top',
                        'text-size':10
                    },
                    'paint':{
                        'text-halo-width':.5,
                        'text-halo-color':'black',
                        'text-color': 'white'
                    }
                });
            }
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
                const geotag = entry.geotag_info.toLowerCase().replace(' ','-');
               _style.backgroundColor = this._vue.$styleConfig.styles["marker-varying"]["color"][geotag] || "grey"
               Object.assign(el.style, _style)
               
            //    if(geotag === 'near-here'){
            //        const outerEl = document.createElement('div');
            //        _style.width=_style.height="32px"
            //        _style.backgroundColor = "rgba(0,200,255,.1)"
            //        _style.transform = 'translate(-12px, -12px)'
            //        _style.border = 'none'
            //        Object.assign(outerEl.style, _style);
            //        el.appendChild(outerEl);
            //    }
               
               // console.log(entry.geotag_info)
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