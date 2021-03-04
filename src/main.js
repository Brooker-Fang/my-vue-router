import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import VueRouter from 'vue-router'
// import VueRouter from './my-vue-router'
Vue.config.productionTip = false
// Vue.use(VueRouter)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
