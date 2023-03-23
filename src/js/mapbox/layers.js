import styleConfig from '../../config/styleConfig.json';

export const eventLayer = {
  'id': 'events-circles',
  'type': 'circle',
  'source': 'events-source',
  'layout': {},
  'paint': {
    'circle-color': [
      'match',
      ['get', 'geotag'],
      'exact_location',
      styleConfig.colors[styleConfig.styles.markerVarying.color["exact-location"]].primary,
      'near_here',
      styleConfig.colors[styleConfig.styles.markerVarying.color["near-here"]].primary,
      "in_this_town_city",
      styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_town_city"]].primary,
      "in_this_country",
      styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_country"]].primary,
      /* other */ '#000000'
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

export const geoJsonLayer = (id, sourceId) => {
  return {
    'id': id,
    'type': 'fill',
    'source': sourceId, // reference the data source
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
}

export const geoJsonLabelLayer = (id) => {
  return {
    'id': id + '-labels',
    'type': 'symbol',
    'source': id + '-labels-source',
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
      'visibility': 'none'
    },
    'paint': {
      'text-halo-width': .5,
      'text-halo-color': 'black',
      'text-color': 'white'
    }
  }
}
