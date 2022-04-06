import Vue from 'vue'
import {
    EventBus
} from './DataManagement/EventBus';
import axios from 'axios';
import mapboxgl from "mapbox-gl";
import turfCentroid from '@turf/centroid'
//var turfCentroid = require('turf-centroid');
import Store from './DataManagement/Store';
export default class LayerManager {
    constructor() {
        this._vue = new Vue({store: Store});
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

    toggleLayer(layerid) {
        if (!this._vue.$map || !this._vue.$map.getLayer(layerid)) return;
        const visibility = this._vue.$map.getLayoutProperty(
            layerid,
            'visibility'
        );

        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === 'visible') {
            this._vue.$map.setLayoutProperty(layerid, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            this._vue.$map.setLayoutProperty(
                layerid,
                'visibility',
                'visible'
            );
        }
    }
    addGeoJSONRemoteToMap(_options) {
        let self = this;
        const beforeLayer = this._vue.$styleConfig["layer-placement"]["geojson"];

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
            //const _visibility = _options["visible-by-default"] ? 'visible' : 'none';
            const layer = {
                'id': _options["layer-id"],
                'type': 'fill',
                'source': srcID, // reference the data source
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'fill-color': ["case",
                    ['==', ["length",['get', 'color']],7], 
                    ['get', 'color'],
                    '#00ffff'],
                    'fill-opacity': 0.25
                }
            }
            if(beforeLayer){  
                this._vue.$map.addLayer(layer,beforeLayer);
            }else{
                this._vue.$map.addLayer(layer);
            }

            if (_options.labels) {
                var result = {
                    "type": "FeatureCollection",
                    "features": []
                };

                for (var i = 0; i < _geojson.features.length; i++) {
                    result.features.push(
                        {
                            "type": "Feature",
                            "properties": { "name": _geojson.features[i].properties.Name },
                            "geometry": turfCentroid(_geojson.features[i]).geometry
                        }
                    );
                }

                this._vue.$map.addSource(_options["layer-id"] + '-labels-source', {
                    'type': 'geojson',
                    'data': result
                });

                this._vue.$map.addLayer({
                    'id': _options["layer-id"] + '-labels',
                    'type': 'symbol',
                    'source': _options["layer-id"] + '-labels-source',
                    'layout': {
                        // get the title name from the source's "title" property
                        'text-field': ['get', 'name'],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top',
                        'text-size': 10,
                        'visibility': _options["visible-by-default"] ? 'visibility' : 'none'
                    },
                    'paint': {
                        'text-halo-width': .5,
                        'text-halo-color': 'black',
                        'text-color': 'white'
                    }
                });
            }
        })
    }
    addBaserowToMap(_options) {
        const beforeLayer = this._vue.$styleConfig["layer-placement"]["events"];
        let layersLeft = +_options.numPages;
        for (let p = 1; p < _options.numPages+1; p++) {
            axios({
                method: "GET",
                url: `https://api.baserow.io/api/database/rows/table/${_options.tableid}/?user_field_names=true&page=${p}&${_options.sizeLimit ? '&size=' : ''}${_options.sizeLimit || ''}${_options.filter ? '&filter=' : ''}${_options.filter || ''}`,
                headers: {
                    Authorization: `Token ${this._vue.$mainConfig.api.keys.baserow}`
                }
            }).then((resp) => {
                const entries = resp.data.results;
                //console.log(entries.length)
                if (!this._vue.$map.getSource('events-source')) {
                    this.addCircleLayer(beforeLayer,entries)
                } else {
                    this.updateCircleLayer(entries);
                }
                layersLeft--;
                if(layersLeft === 0) EventBus.$emit('check-for-url-event');
            }).catch(e =>{
                layersLeft--;
                if(layersLeft === 0) EventBus.$emit('check-for-url-event');
                console.log(e)
            });
        }
    }

    updateCircleLayer(entries) {
        let eventsSource = this._vue.$map.getSource('events-source');
        let existingData = this._vue.$dataManager.eventData;

        for (var i = 0; i < entries.length; i++) {

            existingData.features.push(
                {
                    "type": "Feature",
                    "properties": { "name": entries[i].id, "title": entries[i].title, "geotag": entries[i].geotag_info.toLowerCase().replace(' ', '_') },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            entries[i].longitude || Math.random(), entries[i].latitude || Math.random()
                        ]
                    }
                }
            );
        }
        eventsSource.setData(existingData);
    }

    styleCircleSelection(){
        //console.log()
        const map = this._vue.$map;
        if(this._vue.$store.getters.getSelectedEventId === -1){
            map.setPaintProperty("events-circles", "circle-opacity", 1);
            map.setPaintProperty("events-circles", "circle-stroke-width", 2);
            map.setPaintProperty("events-circles", "circle-stroke-opacity", 1);
            return;
        }

        map.setPaintProperty("events-circles", "circle-opacity", [
            "case",
            ["==", ["get", "name"], this._vue.$store.getters.getSelectedEventId],
            1,
            0.2,
          ]);
  
          map.setPaintProperty("events-circles", "circle-radius", [
            "case",
            ["==", ["get", "name"], this._vue.$store.getters.getSelectedEventId],
            6,
            5,
          ]);
  
          map.setPaintProperty("events-circles", "circle-stroke-width", [
            "case",
            ["==", ["get", "name"], this._vue.$store.getters.getSelectedEventId],
            2,
            1,
          ]);
  
          map.setPaintProperty("events-circles", "circle-stroke-opacity", [
            "case",
            ["==", ["get", "name"], this._vue.$store.getters.getSelectedEventId],
            1,
            0.25,
          ]);
        
    }
    addCircleLayer(beforeLayer,entries) {
        var result = {
            "type": "FeatureCollection",
            "features": []
        };

        for (var i = 0; i < entries.length; i++) {

            result.features.push(
                {
                    "type": "Feature",
                    "properties": { "name": entries[i].id, "title": entries[i].title, "geotag": entries[i].geotag_info.toLowerCase().replace(' ', '_') },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            entries[i].longitude || Math.random(), entries[i].latitude || Math.random()
                        ]
                    }//turfCentroid(entries[i]).geometry
                }
            );
        }

        this._vue.$dataManager.eventData = result;
        //HC
        this._vue.$map.addSource('events-source', {
            'type': 'geojson',
            'data': result
        });

        //HC
        const layer = {
            'id': 'events-circles',
            'type': 'circle',
            'source': 'events-source',
            'layout': {},
            'paint': {
                'circle-color': [
                    'match',
                    ['get', 'geotag'],
                    'exact_location',
                    'yellow',
                    'near_here',
                    '#6600cc',
                    /* other */ '#ccc'
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': 'white'
            }
        }
        if(beforeLayer){  
            this._vue.$map.addLayer(layer,beforeLayer);
        }else{
            this._vue.$map.addLayer(layer);
        }

    }

    addMarkers(entries) {
        entries.forEach(entry => {
            const el = document.createElement('div');
            const _style = this._vue.$styleConfig.styles.marker;
            const geotag = entry.geotag_info.toLowerCase().replace(' ', '-');
            _style.backgroundColor = this._vue.$styleConfig.styles["marker-varying"]["color"][geotag] || "grey"
            // console.log(entry)

            Object.assign(el.style, _style)
            if (geotag === 'near-here') {
                el.style.boxShadow = "0 0 5px 15px #9933ff88"
            }
            //TODO: This should be cleaned up
            const marker = new mapboxgl.Marker(el)
                .setLngLat([entry.longitude, entry.latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`

                    <h3 class="popup-title">${entry.title}</h3>
                    <p>${entry.description}</p>
                    <div class="${entry.media ? 'media-container' : 'hidden'}">
                        <p class="img-caption">${entry.media_caption}</p>
                        <div class="img-container">
                            <img src="${entry.media}">
                        </div>
                    </div>
                    <a id="zoom-to-${entry.id}" href="#">Zoom To</a>
                    
                `))
                .addTo(this._vue.$map);

            if (+this._vue.$mainConfig.multiplyDataTest > 0) {
                for (let i = 0; i < +this._vue.$mainConfig.multiplyDataTest; i++) {
                    const _el = document.createElement('div');
                    const _style = this._vue.$styleConfig.styles.marker;
                    const geotag = entry.geotag_info.toLowerCase().replace(' ', '-');
                    _style.backgroundColor = this._vue.$styleConfig.styles["marker-varying"]["color"][geotag] || "grey"
                    // console.log(entry)

                    Object.assign(_el.style, _style)
                    if (geotag === 'near-here') {
                        _el.style.boxShadow = "0 0 5px 15px #9933ff88"
                    }
                    new mapboxgl.Marker(_el)
                        .setLngLat([+entry.longitude + (Math.random() * 2 - 1), +entry.latitude + (Math.random() * 2 - 1)])
                        .setPopup(new mapboxgl.Popup().setHTML(`

                    <h3 class="popup-title">${entry.title}</h3>
                    <p>${entry.description}</p>
                    <div class="${entry.media ? 'media-container' : 'hidden'}">
                        <p class="img-caption">${entry.media_caption}</p>
                        <div class="img-container">
                            <img src="${entry.media}">
                        </div>
                    </div>
                    
                `))
                        .addTo(this._vue.$map);
                }
            }

            let self = this;
            document.addEventListener('click', function (event) {

                if (!event.target.matches(`#zoom-to-${entry.id}`)) return;

                event.preventDefault();

                self._vue.$map.flyTo({
                    center: [entry.longitude, entry.latitude],
                    zoom: 9,
                    essential: true
                });
            })

        });
    }
}