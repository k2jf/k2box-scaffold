import myAxios from './my-axios'

export default {

  install: function (Vue, options) {
    const axios = myAxios(Vue, options)
    Vue.prototype.$axios = axios
    global.axios = axios
  }
}
