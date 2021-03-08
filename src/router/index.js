import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../my-vue-router'
import Home from '../view/Home'
import About from '../view/About'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
]
const router = new VueRouter({
  mode: 'hash',
  routes
})
export default router