import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.options.root = process.env.VUE_APP_HOST
Vue.config.productionTip = false

if (localStorage.getItem('token'))
  Vue.http.headers.common['Authentication'] = localStorage.getItem('token')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
