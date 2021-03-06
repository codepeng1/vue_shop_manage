import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

