import styleConfig from '../../config/styleConfig.json';

export const eventLayer = {
  'id': 'events-circles',
  'type': 'circle',
  'source': 'events-source',
  'layout': {},
  'paint': {
    'circle-color': [
      'match',
      ['get', 'geotag'],  // Back to 'geotag' (not 'geotag_info')
      'exact_location',  // Back to underscore format
      styleConfig.colors[styleConfig.styles.markerVarying.color["exact_location"]].primary,
      'near_here',  // Back to underscore format
      styleConfig.colors[styleConfig.styles.markerVarying.color["near_here"]].primary,
      "in_this_town_city",  // Back to underscore format
      styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_town_city"]].primary,
      "in_this_country",  // Back to underscore format
      styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_country"]].primary,
      "place_to_visit",  // Add this new converted value
      styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_country"]].primary,
      /* other */ '#000000'  // Keep green for debugging
    ],
    'circle-stroke-width': 2,
    'circle-stroke-color': 'white'
  }
}

//hit layer makes options easier to select
export const eventHitLayer = {
  'id': 'event-hit-layer',
  'type': 'circle',
  'source': 'events-source',
  'layout': {},
  'paint': {
    'circle-color': 'white',
    'circle-opacity': 0,
    'circle-radius': styleConfig.styles.markerVarying["hit-radius"]
  }
}

export const nativeLandsTerritories = {
    id: 'native-lands-territories',
    type: 'fill',
    source: 'native-lands',
    'source-layer': '4pgB_next_nld_terr_prod_source_layer',
    layout: {
      visibility: 'none'
    },
    paint: {
      'fill-opacity': 0.25,
      'fill-outline-color': "hsla(0, 0%, 0%, 0.44)",
      'fill-color': ['get', 'color'],
    }
}

export const nativeLandsTerritoriesText = {
    id: 'native-lands-territories-text',
    type: 'symbol',
    source: 'native-lands',
    "source-layer": '4pgB_next_nld_terr_prod_source_layer',
    layout: {
      visibility: 'none',
      'text-field': [
        "case",
        [
          "in",
          "Osage",
          ["to-string", ["get", "Name"]]
        ],
        "Osage",
        ["to-string", ["get", "Name"]]
      ],
      'text-size': [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 10, 22, 18
      ]
    },
    paint: {
      "text-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 0, 1, 1
      ],
      'text-halo-color': 'white',
      'text-color': '#e3e3e3',
    }
}