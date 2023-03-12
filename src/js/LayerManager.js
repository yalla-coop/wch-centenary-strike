import { EventBus } from './DataManagement/EventBus';
import axios from 'axios';
import turfCentroid from '@turf/centroid'
import styleConfig from '../config/styleConfig.json'
import mainConfig from '../config/mainConfig.json'
export default class LayerManager {
    constructor(app) {
        this._vue = app
        this.layers = [];
        this.sources = [];
        this.eventsLoaded = 0;
        this.exactLocationColorName = styleConfig.styles["marker-varying"]["color"]["exact-location"];
        this.exactLocationColor = styleConfig.colors[this.exactLocationColorName];

        this.nearLocationColorName = styleConfig.styles["marker-varying"]["color"]["near-here"];
        this.nearLocationColor = styleConfig.colors[this.nearLocationColorName];

        this.cityColorName = styleConfig.styles["marker-varying"]["color"]["in_this_town_city"];
        this.cityColor = styleConfig.colors[this.cityColorName];

        this.countryColorName = styleConfig.styles["marker-varying"]["color"]["in_this_country"];
        this.countryColor = styleConfig.colors[this.countryColorName];

    }
    initToggledLayersFromUrl(_map) {
        const toggledLayers = mainConfig["toggleable-layers"];
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
        if (!this._vue.$.appContext.config.globalProperties.$map || !this._vue.$.appContext.config.globalProperties.$map.getLayer(layerid)) return;
        const visibility = this._vue.$.appContext.config.globalProperties.$map.getLayoutProperty(
            layerid,
            'visibility'
        );

        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === 'visible') {
            this._vue.$.appContext.config.globalProperties.$map.setLayoutProperty(layerid, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            this._vue.$.appContext.config.globalProperties.$map.setLayoutProperty(
                layerid,
                'visibility',
                'visible'
            );
        }
    }
    addGeoJSONRemoteToMap(_options) {
        const beforeLayer = styleConfig["layer-placement"]["geojson"];

        axios.get(_options.url).then(resp => {
            const _geojson = {
                type: "FeatureCollection",
                features: resp.data
            };
            const srcID = _options["layer-id"] + '-source';
            //console.log(srcID)
            this._vue.$.appContext.config.globalProperties.$map.addSource(srcID, {
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
                this._vue.$.appContext.config.globalProperties.$map.addLayer(layer, beforeLayer);
            } else {
                this._vue.$.appContext.config.globalProperties.$map.addLayer(layer);
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

                this._vue.$.appContext.config.globalProperties.$map.addSource(_options["layer-id"] + '-labels-source', {
                    'type': 'geojson',
                    'data': result
                });

                this._vue.$.appContext.config.globalProperties.$map.addLayer({
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

    //Going to need to know number of rows to get the number of requests that will need to be made
    getNumRows(_options) {
        return axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/${_options.tableid}/?user_field_names=true&page=1&size=1${_options.filter ? '&' + _options.filter : ''}`,
            headers: {
                Authorization: `Token ${mainConfig.api.keys.baserow}`
            }
        })
    }

    getURLEvent(_id) {
        const _url = `https://api.baserow.io/api/database/rows/table/33215/${_id}/?user_field_names=true`
        return axios({
            method: "GET",
            url: _url,
            headers: {
                Authorization: `Token ${mainConfig.api.keys.baserow}`
            }
        })
    }

    addBaserowToMap(_options, _page) {
        const beforeLayer = styleConfig["layer-placement"]["events"];

        //If there's a selected event load it first on its own before loading all the rest
        if (this._vue.$store.getters.getSelectedEventId > 0) {
            this.getURLEvent(this._vue.$store.getters.getSelectedEventId).then((resp) => {
                const entries = [resp.data];
                if (!this._vue.$.appContext.config.globalProperties.$map.getSource('events-source')) {
                    this.addCircleLayer(beforeLayer, entries, true);
                } else {
                    this.updateCircleLayer(entries, true);
                }
            }).then(()=>{
                EventBus.$emit('select-url-event');
            });
        }

        this.getNumRows(_options).then((resp) => {
            const totalResponsesExpected = resp.data.count;
            const requestsNeeded = Math.ceil(totalResponsesExpected / _options.sizeLimit);

            for (let reqNum = 0; reqNum < requestsNeeded; reqNum++) {
                axios({
                    method: "GET",
                    url: `https://api.baserow.io/api/database/rows/table/${_options.tableid}/?user_field_names=true&page=${reqNum + 1}${_options.sizeLimit ? '&size=' : ''}${_options.sizeLimit || ''}${_options.filter ? '&' + _options.filter : ''}`,
                    headers: {
                        Authorization: `Token ${mainConfig.api.keys.baserow}`
                    }
                }).then((resp) => {
                    const entries = resp.data.results;

                    if (!this._vue.$.appContext.config.globalProperties.$map.getSource('events-source')) {
                        this.addCircleLayer(beforeLayer, entries, false);

                    } else {
                        this.updateCircleLayer(entries, false);
                    }

                    this.eventsLoaded += resp.data.results.length;

                    if (reqNum >= requestsNeeded) {
                        this.eventsLoaded = 0;
                    }
                }).catch(e => {
                    this.eventsLoaded = 0;
                    console.error(e);
                });
            }
        });
    }

    updateCircleLayer(entries, addedFromURL) {
        let eventsSource = this._vue.$.appContext.config.globalProperties.$map.getSource('events-source');
        let existingData = this._vue.$.appContext.app.config.globalProperties.$dataManager.eventData;

        for (var i = 0; i < entries.length; i++) {

            const skipURLEvent = (!addedFromURL && entries[i].id === this._vue.$store.getters.getSelectedEventId);

            if (entries[i].longitude && entries[i].latitude && !skipURLEvent) {

                existingData.features.push(
                    {
                        "type": "Feature",
                        "properties": {
                            "name": entries[i].id,
                            "title": entries[i].title,
                            "geotag": entries[i].geotag_info.toLowerCase().replaceAll(' ', '_').replaceAll('/', '_'),
                            "year": entries[i].year,
                            "month": entries[i].month,
                            "day": entries[i].day
                        },
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
        let self = this;
        const map = this._vue.$.appContext.config.globalProperties.$map;

        const highlightProps = styleConfig.styles["marker-varying"]["highlightable-props"]

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
                "in_this_town_city",
                self.cityColor.primary,
                "in_this_country",
                self.countryColor.primary,
                '#000000'
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
                "in_this_town_city",
                self.cityColor.primary,
                "in_this_country",
                self.countryColor.primary,
                '#000000'
            ],
            ['match',
                ['get', 'geotag'],
                'exact_location',
                self.exactLocationColor.inactive,
                'near_here',
                self.nearLocationColor.inactive,
                "in_this_town_city",
                self.cityColor.inactive,
                "in_this_country",
                self.countryColor.inactive,
                '#000000'
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

    addCircleLayer(beforeLayer, entries, addedFromURL) {

        var result = {
            "type": "FeatureCollection",
            "features": []
        };

        for (var i = 0; i < entries.length; i++) {
            const skipURLEvent = (!addedFromURL && entries[i].id === this._vue.$store.getters.getSelectedEventId);

            if (entries[i].longitude && entries[i].latitude && !skipURLEvent) {
                result.features.push(
                    {
                        "type": "Feature",
                        "properties": {
                            "name": entries[i].id,
                            "title": entries[i].title,
                            "geotag": entries[i].geotag_info.toLowerCase().replaceAll(' ', '_').replaceAll('/', '_'),
                            "year": entries[i].year,
                            "month": entries[i].month,
                            "day": entries[i].day
                        },
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

        this._vue.$.appContext.app.config.globalProperties.$dataManager.eventData = result;
        //HC
        this._vue.$.appContext.config.globalProperties.$map.addSource('events-source', {
            'type': 'geojson',
            'data': result
        });

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
                    "in_this_town_city",
                    this.cityColor.primary,
                    "in_this_country",
                    this.countryColor.primary,
                    /* other */ '#000000'
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': 'white'
            }
        }
        //hit layer makes options easier to select
        const hitLayer = {
            'id': 'event-hit-layer',
            'type': 'circle',
            'source': 'events-source',
            'layout': {},
            'paint': {
                'circle-color': 'white',
                'circle-opacity': 0,
                'circle-radius': styleConfig.styles["marker-varying"]["hit-radius"]
            }
        }
        if (beforeLayer) {
            this._vue.$.appContext.config.globalProperties.$map.addLayer(layer, beforeLayer);
            this._vue.$.appContext.config.globalProperties.$map.addLayer(hitLayer, beforeLayer);
        } else {
            this._vue.$.appContext.config.globalProperties.$map.addLayer(layer);
            this._vue.$.appContext.config.globalProperties.$map.addLayer(hitLayer);
        }

    }

}
