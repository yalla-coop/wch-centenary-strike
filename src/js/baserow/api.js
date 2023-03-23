import mainConfig from '../../config/mainConfig.json'
import axios from 'axios';

const baseUrl = 'https://api.baserow.io/api'
const articlesTable = `${baseUrl}/database/rows/table/${mainConfig.api.baserow.tables.main}`
const defaultFilters = `&filter__field_177157__contains=published
                        &filter__field_177148__not_empty
                        &filter__field_177149__not_empty`

/**
 *
 * @param id id of event in articles table
 *
 * @return {AxiosPromise}
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
 * @return {AxiosPromise}
 */
export const getEvents = (options) => {
  let url = `${articlesTable}/?user_field_names=true${defaultFilters}`
  url += options.pageNumber ? `&page=${options.pageNumber}` : ''
  url += options.sizeLimit ? `&size=${options.sizeLimit}` : ''
  url += options.filter ? `&${options.filter}` : ''
  return axios({
    method: "GET",
    url: url,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}
/**
 *
 * @return {AxiosPromise}
 */
export const getEventCount = () => {
  return axios({
    method: "GET",
    url: `${articlesTable}/?page=1&size=1${defaultFilters}`,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}

export const searchEvents = (searchTerm) => {
  return axios({
    method: "GET",
    url: `${articlesTable}/?user_field_names=true${defaultFilters}&search=${searchTerm}`,
    headers: { Authorization: `Token ${mainConfig.api.keys.baserow}` }
  })
}
