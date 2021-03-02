import VueRouter from 'vue-router'
import Home from '../view/Home'
import About from '../view/About'
const routes = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
]
const router = new VueRouter({
  mode: 'hash',
  routes
})
export default router