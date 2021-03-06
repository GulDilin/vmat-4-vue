import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue-apexcharts'
import vuetify from './plugins/vuetify';

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false


new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
