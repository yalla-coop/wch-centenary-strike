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
        this._vue = new Vue({ store: Store });
        this.layers = [];
        this.sources = [];
        this.eventsLoaded = 0;

        this.exactLocationColorName = this._vue.$styleConfig.styles["marker-varying"]["color"]["exact-location"];
        this.exactLocationColor = this._vue.$styleConfig.colors[this.exactLocationColorName];

        this.nearLocationColorName = this._vue.$styleConfig.styles["marker-varying"]["color"]["near-here"];
        this.nearLocationColor = this._vue.$styleConfig.colors[this.nearLocationColorName];

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
                this.addBaserowToMap(_options, 1);
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
                        ['==', ["length", ['get', 'color']], 7],
                        ['get', 'color'],
                        '#00ffff'],
                    'fill-opacity': 0.25
                }
            }
            if (beforeLayer) {
                this._vue.$map.addLayer(layer, beforeLayer);
            } else {
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
    addBaserowToMap(_options, _page) {
        const beforeLayer = this._vue.$styleConfig["layer-placement"]["events"];

        axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/${_options.tableid}/?user_field_names=true&page=${_page}${_options.sizeLimit ? '&size=' : ''}${_options.sizeLimit || ''}${_options.filter ? '&filter=' : ''}${_options.filter || ''}`,
            headers: {
                Authorization: `Token ${this._vue.$mainConfig.api.keys.baserow}`
            }
        }).then((resp) => {

            const entries = resp.data.results;
            if (!this._vue.$map.getSource('events-source')) {
                this.addCircleLayer(beforeLayer, entries)
            } else {
                this.updateCircleLayer(entries);
            }

            this.eventsLoaded += resp.data.results.length;
            if (resp.data.count > this.eventsLoaded) {
                this.addBaserowToMap(_options, ++_page);
            } else {
                this.eventsLoaded = 0;
                EventBus.$emit('check-for-url-event');
            }
        }).catch(e => {
            this.eventsLoaded = 0;
            EventBus.$emit('check-for-url-event');
            console.error(e)
        });

    }

    updateCircleLayer(entries) {
        let eventsSource = this._vue.$map.getSource('events-source');
        let existingData = this._vue.$dataManager.eventData;

        for (var i = 0; i < entries.length; i++) {
            if (entries[i].longitude && entries[i].latitude) {
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
        }
        eventsSource.setData(existingData);
    }

    styleCircleSelection() {
        //console.log()
        let self = this;
        const map = this._vue.$map;

        const highlightProps = this._vue.$styleConfig.styles["marker-varying"]["highlightable-props"]

        if (this._vue.$store.getters.getSelectedEventId === -1) {
            highlightProps.forEach((prop) => {
                map.setPaintProperty("events-circles", prop["prop-name"], prop["default"]);
            });

            map.setLayoutProperty("events-circles", "circle-sort-key", 0);

            map.setPaintProperty("events-circles", "circle-color", [
                'match',
                ['get', 'geotag'],
                'exact_location',
                self.exactLocationColor.primary,
                'near_here',
                self.nearLocationColor.primary,
                '#00f'
            ]
            );
            return;
        }

        map.setPaintProperty("events-circles", "circle-color", [
            "case",
            ["==", ["get", "name"], this._vue.$store.getters.getSelectedEventId],
            ['match',
                ['get', 'geotag'],
                'exact_location',
                self.exactLocationColor.primary,
                'near_here',
                self.nearLocationColor.primary,
                '#00f'
            ],
            ['match',
                ['get', 'geotag'],
                'exact_location',
                self.exactLocationColor.inactive,
                'near_here',
                self.nearLocationColor.inactive,
                '#f00'
            ]
        ]);

        map.setLayoutProperty("events-circles", "circle-sort-key", [
            "case",
            ["==", ["get", "name"], this._vue.$store.getters.getSelectedEventId],
            9,
            0
        ]);

        highlightProps.forEach((prop) => {
            map.setPaintProperty("events-circles", prop["prop-name"], [
                "case",
                ["==", ["get", "name"], this._vue.$store.getters.getSelectedEventId],
                prop["active"],
                prop["inactive"]
            ]
            );
        });

    }

    addCircleLayer(beforeLayer, entries) {

        var result = {
            "type": "FeatureCollection",
            "features": []
        };

        for (var i = 0; i < entries.length; i++) {
            if (entries[i].longitude && entries[i].latitude) {
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
        }

        this._vue.$dataManager.eventData = result;
        //HC
        this._vue.$map.addSource('events-source', {
            'type': 'geojson',
            'data': result
        });
        // console.log(this._vue.$styleConfig.colors["yellow.primary"])

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
                    this.exactLocationColor.primary,
                    'near_here',
                    this.nearLocationColor.primary,
                    /* other */ '#0f0'
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': 'white'
            }
        }

        const hitLayer = {
            'id': 'event-hit-layer',
            'type': 'circle',
            'source': 'events-source',
            'layout': {},
            'paint': {
                'circle-color': 'white',
                'circle-opacity': 0,
                'circle-radius': this._vue.$styleConfig.styles["marker-varying"]["hit-radius"]
            }
        }
        if (beforeLayer) {
            this._vue.$map.addLayer(layer, beforeLayer);
            this._vue.$map.addLayer(hitLayer, beforeLayer);
        } else {
            this._vue.$map.addLayer(layer);
            this._vue.$map.addLayer(hitLayer);
        }

    }
    //DEPRICATED:
    // addMarkers(entries) {
    //     entries.forEach(entry => {
    //         const el = document.createElement('div');
    //         const _style = this._vue.$styleConfig.styles.marker;
    //         const geotag = entry.geotag_info.toLowerCase().replace(' ', '-');
    //         //_style.backgroundColor = this._vue.$styleConfig.styles["marker-varying"]["color"][geotag] || "grey"
    //         // console.log(entry)
    //         _style.backgroundColor = this._vue.$styleConfig.colors[
    //             this._vue.$styleConfig.styles["marker-varying"]["color"][geotag]
    //         ] || "grey"
    //         Object.assign(el.style, _style)
    //         if (geotag === 'near-here') {
    //             el.style.boxShadow = "0 0 5px 15px #9933ff88"
    //         }
    //         //TODO: This should be cleaned up
    //         const marker = new mapboxgl.Marker(el)
    //             .setLngLat([entry.longitude, entry.latitude])
    //             .setPopup(new mapboxgl.Popup().setHTML(`

    //                 <h3 class="popup-title">${entry.title}</h3>
    //                 <p>${entry.description}</p>
    //                 <div class="${entry.media ? 'media-container' : 'hidden'}">
    //                     <p class="img-caption">${entry.media_caption}</p>
    //                     <div class="img-container">
    //                         <img src="${entry.media}">
    //                     </div>
    //                 </div>
    //                 <a id="zoom-to-${entry.id}" href="#">Zoom To</a>

    //             `))
    //             .addTo(this._vue.$map);

    //         if (+this._vue.$mainConfig.multiplyDataTest > 0) {
    //             for (let i = 0; i < +this._vue.$mainConfig.multiplyDataTest; i++) {
    //                 const _el = document.createElement('div');
    //                 const _style = this._vue.$styleConfig.styles.marker;
    //                 const geotag = entry.geotag_info.toLowerCase().replace(' ', '-');
    //                 _style.backgroundColor = this._vue.$styleConfig.colors[
    //                     this._vue.$styleConfig.styles["marker-varying"]["color"][geotag]
    //                 ] || "grey"
    //                 // console.log(entry)

    //                 Object.assign(_el.style, _style)
    //                 if (geotag === 'near-here') {
    //                     _el.style.boxShadow = "0 0 5px 15px #9933ff88"
    //                 }
    //                 new mapboxgl.Marker(_el)
    //                     .setLngLat([+entry.longitude + (Math.random() * 2 - 1), +entry.latitude + (Math.random() * 2 - 1)])
    //                     .setPopup(new mapboxgl.Popup().setHTML(`

    //                 <h3 class="popup-title">${entry.title}</h3>
    //                 <p>${entry.description}</p>
    //                 <div class="${entry.media ? 'media-container' : 'hidden'}">
    //                     <p class="img-caption">${entry.media_caption}</p>
    //                     <div class="img-container">
    //                         <img src="${entry.media}">
    //                     </div>
    //                 </div>

    //             `))
    //                     .addTo(this._vue.$map);
    //             }
    //         }

    //         let self = this;
    //         document.addEventListener('click', function (event) {

    //             if (!event.target.matches(`#zoom-to-${entry.id}`)) return;

    //             event.preventDefault();

    //             self._vue.$map.flyTo({
    //                 center: [entry.longitude, entry.latitude],
    //                 zoom: 9,
    //                 essential: true
    //             });
    //         })

    //     });
    // }
}