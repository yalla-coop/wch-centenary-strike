import mainConfig from '../../config/mainConfig.json'
import Axios from 'axios';
import axiosRetry from 'axios-retry';
import { setupCache, buildWebStorage } from 'axios-cache-interceptor';

const baseUrl = 'https://api.baserow.io/api'
const articlesTable = `${baseUrl}/database/rows/table/${mainConfig.api.baserow.tables.articles}`
const tagsTable = `${baseUrl}/database/rows/table/${mainConfig.api.baserow.tables.tags}`
const categoryIds = mainConfig.api.baserow.categoryIds
const defaultFilters = `&filter__field_177157__contains=published&filter__field_177148__not_empty&filter__field_177149__not_empty`
const axios = setupCache(Axios, {
  storage: buildWebStorage(localStorage, 'axios-cache'),
  cacheTakeover: false, // Baserow is not accepting "pragma" header
  ttl: process.env.VUE_APP_ENV === 'DEV' ? 1800000 : 300000
})
// baserow does not allow table joins, large limits (>200), including tags with events,
// or other workarounds to fetching all sequentially
// Many separate requests must be made to retrieve tag information
// However, baserow will also occasionally throttle connections with a 1s `retry-after`
axiosRetry(axios, {
  retries: 3,
  retryDelay: () => { return 1000 },
  retryCondition: (error) => { return error.response && error.response.status === 429 }
})

/**
 *
 * @param id id of event in articles table
 *
 * @return {Promise<CacheAxiosResponse<any, any>>}
 */
export const getEvent = (id) => {
  return axios({
    method: "GET",
    url: `${articlesTable}/${id}/?user_field_names=true`,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}`}
  })
}

/**
 *
 * @param options
 * @param options.pageNumber
 * @param options.sizeLimit
 * @param options.filter
 *
 * @return {Promise<CacheAxiosResponse<any, any>>}
 */
export const getEvents = (options) => {
  let url = `${articlesTable}/?user_field_names=true${defaultFilters}`
  url += options.pageNumber ? `&page=${options.pageNumber}` : ''
  url += options.sizeLimit ? `&size=${options.sizeLimit}` : ''
  url += options.filter ? `&${options.filter}` : ''
  url += `&include=title,geotag_info,year,month,day,latitude,longitude,status,tags`
  return axios({
    method: "GET",
    url: url,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}


/**
 * Get events specifically for the Centenary Strike Map
 * Uses the correct tag ID (8429) for "1926 general strike"
 * 
 * @param options
 * @param options.pageNumber
 * @param options.sizeLimit
 * @param options.filter
 * 
 * @return {Promise<CacheAxiosResponse<any, any>>}
 */
export const getCentenaryStrikeEvents = (options = {}) => {
  let url = `${articlesTable}/?user_field_names=true${defaultFilters}`
  
  // Filter by the specific tag ID for "1926 general strike"
  url += `&filter__tags__link_row_has=8429`
  
  url += options.pageNumber ? `&page=${options.pageNumber}` : ''
  url += options.sizeLimit ? `&size=${options.sizeLimit}` : ''
  url += options.filter ? `&${options.filter}` : ''
  url += `&include=title,geotag_info,year,month,day,latitude,longitude,status,tags`
  
  return axios({
    method: "GET",
    url: url,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}

/**
 * Get event count for Centenary Strike Map
 */
export const getCentenaryStrikeEventCount = (options = {}) => {
  let url = `${articlesTable}/?page=1&size=1${defaultFilters}`
  
  // IMPORTANT: Add the SAME filter as in getCentenaryStrikeEvents
  url += `&filter__tags__link_row_has=8429`
  
  url += options.filter ? `&${options.filter}` : ''

  return axios({
    method: "GET",
    url: url,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}

/**
 *
 * @return {Promise<CacheAxiosResponse<any, any>>}
 */
export const getEventCount = (options) => {
  let url = `${articlesTable}/?page=1&size=1${defaultFilters}`
  url += options.filter ? `&${options.filter}` : ''

  return axios({
    method: "GET",
    url: url,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}

/**
 *
 * @param searchTerm string
 *
 * @return {Promise<CacheAxiosResponse<any, any>>}
 */
export const searchEvents = (searchTerm) => {
  return axios({
    method: "GET",
    url: `${articlesTable}/?user_field_names=true${defaultFilters}&search=${searchTerm}`,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}

/**
 *
 * @param options
 * @param options.categoryId
 *
 * @return {Promise<CacheAxiosResponse<any, any>>}
 */
export const getTagCountForCategory = (options) => {
  let url = `${tagsTable}/?user_field_names=true&page=1&size=1&filter__field_177169__boolean=true`
  url += options.categoryId ? `&filter__field_177168__single_select_equal=${options.categoryId}` : ''
  return axios({
    method: "GET",
    url: url,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}

export const getAllTagsForCategory = (category, storeTags) => {
  let categoryId = categoryIds[category]
  getTagCountForCategory({categoryId: categoryId}).then((resp) => {
    const totalResponsesExpected = resp.data.count;
    const requestsNeeded = Math.ceil(totalResponsesExpected / 200);

    for(let reqNum = 0; reqNum < requestsNeeded; reqNum++) {
      getTags({pageNumber: reqNum + 1, sizeLimit: 200, categoryId: categoryId}).then((resp) => {
        storeTags(resp.data.results);
      })
    }
  })
}

/**
 *
 * @param options
 * @param options.pageNumber
 * @param options.sizeLimit
 * @param options.categoryId
 *
 * @return {Promise<CacheAxiosResponse<any, any>>}
 */
export const getTags = (options) => {
  let url = `${tagsTable}/?user_field_names=true&include=Title,Category,Active&filter__field_177169__boolean=true`
  url += options.pageNumber ? `&page=${options.pageNumber}` : ''
  url += options.sizeLimit ? `&size=${options.sizeLimit}` : ''
  url += options.categoryId ? `&filter__field_177168__single_select_equal=${options.categoryId}` : ''
  return axios({
    method: "GET",
    url: url,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}
