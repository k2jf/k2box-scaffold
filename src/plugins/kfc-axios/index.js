import myFetchAxios from './my-fetch-axios'

export default {

  install: function (Vue, options) {
    const axios = myFetchAxios(Vue, options)
    Vue.prototype.$axios = axios
    global.axios = axios
  }
}
