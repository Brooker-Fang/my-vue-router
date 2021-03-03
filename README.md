## Hash模式
+ 1、hash即URL中#后面的部分。
+ 2、如果网页URL带有hash，页面会定位到id与hash一样的元素的位置，即锚点
+ 3、hash的改变时，页面不会重新加载，会触发hashchange事件，而且也会被记录到浏览器的历史记录中
+ 4、vue-router的hash模式，主要就是通过监听hashchange事件，根据hash值找到对应的组件进行渲染
## History模式
+ 1、通过history.pushState修改页面地址
+ 2、当history改变时会触发popstate事件，所以可以通过监听popstate事件获取路由地址
+ 3、根据路由地址找到对应组件进行渲染

## vue-router使用
```js
import VueRouter from 'vue-router'
// 注册VueRouter插件
// Vue.use方法 
// 1、如果传入的是方法，则调用传入的方法
// 2、如果传入的是对象，则会调用插件的install静态方法，并传入Vue构造函数
Vue.use(VueRouter)
// 创建路由表
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
// 创建路由对象
const router = new VueRouter({
  mode: 'hash',
  routes
})
// 实例化Vue时，在实例上注册router对象
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
// 组件中使用<router-view> 替换 渲染组件
// 组件中使用<router-link> 组件跳转
// 说明要 注册<router-view>和<router-link>全局组件
// 组件中 通过this.$router 获取路由对象，并且this.$router.path是
```
## 总结，VueRouter需要做以下这些事情
+ 1、Vue.use会先调用VueRouter的静态install方法
+ 2、