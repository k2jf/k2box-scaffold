import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview.js'
import kfcAxios from './plugins/kfc-axios'

Vue.config.productionTip = false

Vue.use(kfcAxios, {
  // see src/plugins/kfx-axios/README.md for more information
  baseUrl: '/api'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
