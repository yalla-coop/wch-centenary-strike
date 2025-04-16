import { EventBus } from './DataManagement/EventBus';
import axios from 'axios';
import turfCentroid from '@turf/centroid'
import styleConfig from '../config/styleConfig.json'
import mainConfig from '../config/mainConfig.json'
import * as palettes from './mapbox/propertyPalettes.js'
import * as baserowApi from './baserow/api.js'
import * as layers from './mapbox/layers.js'

export default class LayerManager {
    constructor(app) {
        this._vue = app
        this.layers = [];
        this.sources = [];
    }
    initToggledLayers(_map) {
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
                this.addBaserowToMap(_options);
                break;
            default: break;
        }
    }

    toggleLayer(layerid) {
        const map = this._vue.$map;

        if (!map || !map.getLayer(layerid)) return;
        const visibility = map.getLayoutProperty(layerid, 'visibility');

        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === 'visible') {
            map.setLayoutProperty(layerid, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(layerid, 'visibility', 'visible');
        }
    }

    addGeoJSONRemoteToMap(_options) {
        const beforeLayer = styleConfig["layer-placement"]["geojson"];
        const map = this._vue.$map;

        axios.get(_options.url).then(resp => {
            const _geojson = resp.data;
            const srcID = _options["layer-id"] + '-source';
            map.addSource(srcID, {
                'type': 'geojson',
                'data': _geojson
            });
            const layer = layers.geoJsonLayer(_options["layer-id"], srcID)
            if (beforeLayer) {
                map.addLayer(layer, beforeLayer);
            } else {
                map.addLayer(layer);
            }

            if (_options.labels) {
                let result = {
                    'type': 'FeatureCollection',
                    'features': []
                };

                for (let i = 0; i < _geojson.features.length; i++) {
                    result.features.push(
                        {
                            "type": "Feature",
                            "properties": { "name": _geojson.features[i].properties.Name },
                            "geometry": turfCentroid(_geojson.features[i]).geometry
                        }
                    );
                }

                map.addSource(_options["layer-id"] + '-labels-source', {
                    'type': 'geojson',
                    'data': result
                });

                map.addLayer(layers.geoJsonLabelLayer(_options["layer-id"]));
            }
            EventBus.$emit('enable-toggled-layers')
        })
    }

    addBaserowToMap(_options) {
        const beforeLayer = styleConfig["layer-placement"]["events"];
        const map = this._vue.$map;


        if(_options.reinitialize) {
            this.addCircleLayer(beforeLayer, _options.appliedFilter)
            return
        }

        //If there's a selected event load it first on its own before loading all the rest
        if (this._vue.$store.getters.getSelectedEventId > 0) {
            baserowApi.getEvent(this._vue.$store.getters.getSelectedEventId).then((resp) => {
                const event = [resp.data];
                this.addEventsToFeatureCollection(event, true)
                if (!map.getSource('events-source')) {
                    this.addCircleLayer(beforeLayer);
                } else {
                    map.getSource('events-source').setData(this._vue.$store.getters.getFeatureCollection)
                }
            this.styleCircleSelection([this._vue.$store.getters.getSelectedEventId]);
            }).then(()=>{
                EventBus.$emit('select-url-event');
            });
        }

        baserowApi.getEventCount({}).then((resp) => {
            const totalResponsesExpected = resp.data.count;
            const requestsNeeded = Math.ceil(totalResponsesExpected / _options.sizeLimit);

            for (let reqNum = 0; reqNum < requestsNeeded; reqNum++) {
                baserowApi.getEvents({pageNumber: reqNum + 1, sizeLimit: _options.sizeLimit, filter: _options.filter}).then((resp) => {
                    const events = resp.data.results;
                    this.addEventsToFeatureCollection(events, false)

                    if (!map.getSource('events-source')) {
                        this.addCircleLayer(beforeLayer);

                    } else {
                        map.getSource('events-source').setData(this._vue.$store.getters.getFeatureCollection)
                    }
                    if(this._vue.$store.getters.getSelectedEventId > 0){
                        this.styleCircleSelection([this._vue.$store.getters.getSelectedEventId]);
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
            EventBus.$emit('events-load-enqueued')
        });
    }

    clearCircleFeatureStyling() {
        const map = this._vue.$map;
        const highlightProps = styleConfig.styles.markerVarying.highlightableProps

        if(!map.getLayer('events-circles')) { return }

        this.clearFilter()
        map.setPaintProperty("events-circles", "circle-color", palettes.defaultColorsForGeotag);
        map.setLayoutProperty("events-circles", "circle-sort-key", 0);
        for(let prop in highlightProps) {
            map.setPaintProperty("events-circles", prop, highlightProps[prop].default);
        }
    }

    styleCircleSelection(features = []) {
        const map = this._vue.$map;
        const highlightProps = styleConfig.styles.markerVarying.highlightableProps

        map.setPaintProperty("events-circles", "circle-color", palettes.highlightedColorsForFeatures(features));
        map.setLayoutProperty("events-circles", "circle-sort-key", palettes.highlightSortForResults(features));
        for(let prop in highlightProps) {
            map.setPaintProperty("events-circles", prop, [
              "case",
                ["in", ["get", "id"], ["literal", features]], highlightProps[prop].active,
                highlightProps[prop].inactive
            ]);
        }
    }

    filterResults(features = []) {
        const map = this._vue.$map;
        map.setFilter('events-circles', ["in", ["get", "id"], ["literal", features]])
        map.setFilter('event-hit-layer', ["in", ["get", "id"], ["literal", features]])
    }

    clearFilter() {
        const map = this._vue.$map
        map.setFilter('events-circles', null)
        map.setFilter('event-hit-layer', null)
    }

    addCircleLayer(beforeLayer, appliedFilter = null) {
        let result = this._vue.$store.getters.getFeatureCollection
        const map = this._vue.$map;
        let day = this._vue.$store.getters.getDay
        let month = this._vue.$store.getters.getMonth

        map.addSource('events-source', {
            'type': 'geojson',
            'data': result
        });

        if (beforeLayer) {
            map.addLayer(layers.eventLayer, beforeLayer);
            map.addLayer(layers.eventHitLayer, beforeLayer);
        } else {
            map.addLayer(layers.eventLayer);
            map.addLayer(layers.eventHitLayer);
        }
        if(appliedFilter){
            map.setFilter('events-circles', appliedFilter)
        } else if(day > 0 && month > 0) {
            map.setFilter('events-circles', [
                  "all",
                  ["==", ["get", "month"], `${month}`],
                  ["==", ["get", "day"], `${day}`]
              ]
            )
        } else if(month > 0 && day === 0) {
            map.setFilter('events-circles', [
                  "all",
                  ["==", ["get", "month"], `${month}`],
                  ["==", ["get", "day"], null]
              ]
            )
        }
    }

    addEventsToFeatureCollection(events, addedFromURL) {
        events.forEach((event) => {
            const skipURLEvent = (!addedFromURL && event.id === this._vue.$store.getters.getSelectedEventId);
            if (event.longitude && event.latitude && !skipURLEvent) {
                this._vue.$store.commit("pushFeatureToCollection",
                  {
                      "type": "Feature",
                      "properties": {
                          "id": event.id,
                          "title": event.title,
                          "geotag": event.geotag_info.toLowerCase().replaceAll(' ', '_').replaceAll('/', '_'),
                          "year": event.year,
                          "month": event.month,
                          "day": event.day,
                          "tags": event.tags
                      },
                      "geometry": {
                          "type": "Point",
                          "coordinates": [
                              event.longitude || Math.random(), event.latitude || Math.random()
                          ]
                      }
                  }
                );
            }
        })
    }
}
