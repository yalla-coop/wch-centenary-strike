import styleConfig from '../../config/styleConfig.json';

const exactLocationColor = styleConfig.colors[styleConfig.styles.markerVarying.color["exact_location"]];
const nearLocationColor = styleConfig.colors[styleConfig.styles.markerVarying.color["near_here"]];
const cityColor = styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_town_city"]];
const countryColor = styleConfig.colors[styleConfig.styles.markerVarying.color["in_this_country"]];

export const defaultColorsForGeotag = [
  'match',
  ['get', 'geotag'],  // Back to 'geotag'
  'exact_location',  // Back to underscore format
  exactLocationColor.primary,
  'near_here',  // Back to underscore format
  nearLocationColor.primary,
  "in_this_town_city",  // Back to underscore format
  cityColor.primary,
  "in_this_country",  // Back to underscore format
  countryColor.primary,
  "place_to_visit",  // Add this converted value
  countryColor.primary,
  '#000000'  // Keep green for debugging
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
     ['get', 'geotag'],  // Back to 'geotag'
     'exact_location',  // Back to underscore format
     exactLocationColor.primary,
     'near_here',  // Back to underscore format
     nearLocationColor.primary,
     "in_this_town_city",  // Back to underscore format
     cityColor.primary,
     "in_this_country",  // Back to underscore format
     countryColor.primary,
     "place_to_visit",  // Add this converted value
     countryColor.primary,
     '#00FF00'  // Green for debugging
   ],
   ['match',
     ['get', 'geotag'],  // Back to 'geotag'
     'exact_location',  // Back to underscore format
     exactLocationColor.inactive,
     'near_here',  // Back to underscore format
     nearLocationColor.inactive,
     "in_this_town_city",  // Back to underscore format
     cityColor.inactive,
     "in_this_country",  // Back to underscore format
     countryColor.inactive,
     "place_to_visit",  // Add this converted value
     countryColor.inactive,
     '#00FF00'  // Green for debugging
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