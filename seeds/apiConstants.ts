const API_LINK = 'https://api.minfin.com.ua';
const API_KEY = '7cb25affaa566ea7d0671ccfc9d989abbd8ccbc0';

const getApiEndpoint = (endpoint) =>
  `${API_LINK}/${endpoint}/${API_KEY}`

export default {
  BANKS: getApiEndpoint('exchrates'),
}
