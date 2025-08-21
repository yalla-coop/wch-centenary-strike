import { EventBus } from './DataManagement/EventBus';
import styleConfig from '../config/styleConfig.json'
import * as palettes from './mapbox/propertyPalettes.js'
import * as baserowApi from './baserow/api.js'
import * as layers from './mapbox/layers.js'

export default class LayerManager {
    constructor(app) {
        this._vue = app
        this.layers = [];
        this.sources = [];
    }
    addNativeLandsLayer() {
        const map = this._vue.$map;

        if (!map.getSource('native-lands')) {
            map.addSource('native-lands', {
                "url": "mapbox://nativeland.4pgB_next_nld_terr_prod_layer",
                "type": "vector"
            });
        }

        if (!map.getLayer(layers.nativeLandsTerritories.id)) {
            map.addLayer(layers.nativeLandsTerritories, styleConfig["layer-placement"]["geojson"]);
        }

        if (!map.getLayer(layers.nativeLandsTerritoriesText.id)) {
            map.addLayer(layers.nativeLandsTerritoriesText, styleConfig["layer-placement"]["geojson"])
        }

        if (this._vue.$store.getters.getNativeLandsLayerVisible) {
            map.setLayoutProperty('native-lands-territories', 'visibility', 'visible');
            map.setLayoutProperty('native-lands-territories-text', 'visibility', 'visible');
        }

        if (map.getSource('native-lands').tiles) { // Check if tiles available
            this._vue.$store.commit('setNativeLandsLayerAvailable', true)
        }
    }

    toggleNativeLands() {
        const map = this._vue.$map;

        if (!map || !map.getSource('native-lands')) return;
        const visibility = map.getLayoutProperty('native-lands-territories', 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty('native-lands-territories', 'visibility', 'none');
            map.setLayoutProperty('native-lands-territories-text', 'visibility', 'none');
        } else {
            map.setLayoutProperty('native-lands-territories', 'visibility', 'visible');
            map.setLayoutProperty('native-lands-territories-text', 'visibility', 'visible');
        }
        this._vue.$store.dispatch('toggleNativeLandsLayerVisible')
    }


addBaserowToMap() {
    const beforeLayer = styleConfig["layer-placement"]["events"];
    const map = this._vue.$map;
    const store = this._vue.$store;
    const baserowSizeLimit = 150;

    if(store.getters.getEventFilters) {
        this.addCircleLayer(beforeLayer, store.getters.getEventFilters)
        return
    }

    if (!map.getSource('events-source')) {
        this.addCircleLayer(beforeLayer);
    } else {
        map.getSource('events-source').setData(store.getters.getFeatureCollection)
    }

    if(store.getters.getFeatureCollection.features.length > 0) { return; }

    // Initial load of data:
    // If there's a selected event load it first on its own before loading all the rest
    if (store.getters.getSelectedEventId > 0) {
        baserowApi.getEvent(store.getters.getSelectedEventId).then((resp) => {
            const event = [resp.data];
            this.addEventsToFeatureCollection(event, true)
            this.styleCircleSelection([store.getters.getSelectedEventId]);
        })
    }

    // SIMPLIFIED APPROACH: Since we know there are only ~10 Centenary Strike events,
    // we can load them all in one or two requests instead of using the count
    console.log('Loading Centenary Strike Map events...');
    
    // Load first page to see how many events we actually have
    baserowApi.getCentenaryStrikeEvents({pageNumber: 1, sizeLimit: baserowSizeLimit}).then((resp) => {
        const events = resp.data.results;
        const totalEvents = resp.data.count;
        
        console.log(`Found ${totalEvents} total Centenary Strike events`);
        console.log(`Page 1: Loaded ${events.length} events`);
        
        // Add events from first page
        this.addEventsToFeatureCollection(events, false);
        
        if (!map.getSource('events-source')) {
            this.addCircleLayer(beforeLayer);
        } else {
            map.getSource('events-source').setData(store.getters.getFeatureCollection)
        }
        
        if(store.getters.getSelectedEventId > 0){
            this.styleCircleSelection([store.getters.getSelectedEventId]);
        }

        // Only load additional pages if we have more events than the page size
        if (totalEvents > baserowSizeLimit) {
            const requestsNeeded = Math.ceil(totalEvents / baserowSizeLimit);
            console.log(`Loading ${requestsNeeded - 1} additional pages...`);
            
            // Load remaining pages with delay to avoid rate limiting
            for (let reqNum = 1; reqNum < requestsNeeded; reqNum++) {
                setTimeout(() => {
                    baserowApi.getCentenaryStrikeEvents({pageNumber: reqNum + 1, sizeLimit: baserowSizeLimit}).then((resp) => {
                        const additionalEvents = resp.data.results;
                        console.log(`Page ${reqNum + 1}: Loaded ${additionalEvents.length} events`);
                        
                        if (additionalEvents.length > 0) {
                            this.addEventsToFeatureCollection(additionalEvents, false);
                            map.getSource('events-source').setData(store.getters.getFeatureCollection);
                        }
                        
                        if(store.getters.getSelectedEventId > 0){
                            this.styleCircleSelection([store.getters.getSelectedEventId]);
                        }
                    }).catch(e => {
                        console.error(`Error loading page ${reqNum + 1}:`, e);
                    });
                }, reqNum * 1000); // 1 second delay between requests
            }
        }
        
        console.log(`Finished loading Centenary Strike Map. Total events: ${store.getters.getFeatureCollection.features.length}`);
        EventBus.$emit('events-load-enqueued');
        
    }).catch(e => {
        console.error('Error loading Centenary Strike events:', e);
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

        if(!map.getLayer('events-circles')) { return }

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

    filterResultsById(features = []) {
        const eventFilter = ["in", ["get", "id"], ["literal", features]]
        this.filterEvents(eventFilter)
    }

    filterEvents(filter) {
        this._vue.$store.commit('setEventFilters', filter)
        this._vue.$map.setFilter('events-circles', filter)
        this._vue.$map.setFilter('event-hit-layer', filter)
    }

    clearFilter() {
        const map = this._vue.$map
        this._vue.$store.commit('setEventFilters', null)
        map.setFilter('events-circles', null)
        map.setFilter('event-hit-layer', null)
    }

    addCircleLayer(beforeLayer, appliedFilter = null) {
        let result = this._vue.$store.getters.getFeatureCollection
        const map = this._vue.$map;
        let day = this._vue.$store.getters.getDay
        let month = this._vue.$store.getters.getMonth

        if (!map.getSource('events-source')) {
            map.addSource('events-source', {
                'type': 'geojson',
                'data': result
            });
        }

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
