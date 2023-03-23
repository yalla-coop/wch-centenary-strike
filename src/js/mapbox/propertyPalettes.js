import styleConfig from '../../config/styleConfig.json';

const exactLocationColor = styleConfig.colors[styleConfig.styles.markerVarying.color["exact-location"]];
const nearLocationColor = styleConfig.colors[styleConfig.styles.markerVarying.color["near-here"]];
const cityColor = styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_town_city"]];
const countryColor = styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_country"]];

export const defaultColorsForGeotag = [
  'match',
  ['get', 'geotag'],
  'exact_location',
  exactLocationColor.primary,
  'near_here',
  nearLocationColor.primary,
  "in_this_town_city",
  cityColor.primary,
  "in_this_country",
  countryColor.primary,
  '#000000'
];

/**
 * Highlights color for features in array and dulls any that are not
 * @param features highlighted results
 * @return {array}
 */
export const highlightedColorsForFeatures = (features = []) => {
 return [
   "case",
   ["in", ["get", "id"], ["literal", features]],
   ['match',
     ['get', 'geotag'],
     'exact_location',
     exactLocationColor.primary,
     'near_here',
     nearLocationColor.primary,
     "in_this_town_city",
     cityColor.primary,
     "in_this_country",
     countryColor.primary,
     '#000000'
   ],
   ['match',
     ['get', 'geotag'],
     'exact_location',
     exactLocationColor.inactive,
     'near_here',
     nearLocationColor.inactive,
     "in_this_town_city",
     cityColor.inactive,
     "in_this_country",
     countryColor.inactive,
     '#000000'
   ]
 ]
};

/**
 * Enlarges radius for feature ids in array and diminishes any that are not
 * @param featureIds highlighted results
 * @return {array}
 */
export const highlightRadiusForResults = (featureIds) => {
  return [
    "case",
    ["in", ["get", "id"], ["literal", featureIds]], styleConfig.styles.markerVarying.highlightableProps['circle-radius'].active,
    styleConfig.styles.markerVarying.highlightableProps['circle-radius'].inactive,
  ]
}

/**
 * Features with a higher sort key will appear above features with a lower sort key.
 * @param featureIds highlighted results
 * @return {array}
 */
export const highlightSortForResults = (featureIds) => {
  return [
    "case",
    ["in", ["get", "id"], ["literal", featureIds]], 9,
    0,
  ]
}



