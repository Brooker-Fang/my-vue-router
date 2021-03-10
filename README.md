## Hash模式
+ 1、hash即URL中#后面的部分。
+ 2、如果网页URL带有hash，页面会定位到id与hash一样的元素的位置，即锚点
+ 3、hash的改变时，页面不会重新加载，会触发hashchange事件，而且也会被记录到浏览器的历史记录中
+ 4、vue-router的hash模式，主要就是通过监听hashchange事件，根据hash值找到对应的组件进行渲染（源码里会先判断浏览器支不支持popstate事件，如果支持，则是通过监听popstate事件，如果不支持，则监听hashchange事件）
## History模式
+ 1、通过history.pushState修改页面地址
+ 2、当history改变时会触发popstate事件，所以可以通过监听popstate事件获取路由地址
+ 3、根据路由地址找到对应组件进行渲染

## vue-router使用
### 1、注册vue-router插件
```js
import VueRouter from 'vue-router'
// 注册VueRouter插件
// Vue.use方法 
// 1、如果传入的是方法，则调用传入的方法
// 2、如果传入的是对象，则会调用插件的install静态方法，并传入Vue构造函数
Vue.use(VueRouter)
```
### 2、创建Router实例
```js
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
// 实例化路由对象
const router = new VueRouter({
  mode: 'hash',
  routes
})
```
### 3、Vue实例上挂载router实例
```js
// 实例化Vue时，在实例上注册router对象
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
```
### 组件中使用
```js
<router-view></router-view>
<router-link to="/home"><route-link>
// 通过this.$router获取路由对象
```
## 总结，VueRouter需要做以下这些事情
+ 1、实现install静态方法
+ 2、根据传入的路由配置，生成对应的路由映射
+ 3、给Vue实例挂载router实例
+ 4、注册全局组件<router-view>和<router-link>, router-view组件通过当前url找到对应组件进行渲染，并且url改变时，重新渲染组件，router-link则渲染为a标签
+ 5、通过currentUrl变量保存当前url，并使数据变为响应式
+ 6、监听hashchange或popState事件，浏览器记录改变时重新渲染router-view组件
## 代码实现
```js
let VueConstructor = null
export default class MyVueRouter {
  static install(Vue) {
    /* 
     1、保存Vue构造函数
     2、在Vue实例挂载 $router实例
     3、注册全局组件<router-view></router-view> 和 <router-link>
    */
    // 判断是否已经执行过install  
    if(MyVueRouter.installed) {
      return
    }
    MyVueRouter.installed = true
    // 1 保存Vue构造函数
    VueConstructor = Vue
    // 2、通过全局混入的方式，在Vue实例挂载 $router实例
    // install执行的时候，Vue还没有实例化，所以通过mixin。在Vue实例化时去挂载router
    // 因为是全局混入，要判断是不是根实例，才需要挂载router
    Vue.mixin({
      beforeCreate() {
        // 只有根实例 才需要挂载$router, 组件不需要执行
        if (this.$options.router) {
          // new Vue(options)时，已经把router对象保存到$options里，所以可以通过$options.router获取
          console.log('this.$options.router==', this.$options.router)
          Vue.prototype.$router = this.$options.router
        }
        
      },
    })
    // 3、注册全局组件<router-view></router-view> 和 <router-link>
    // <router-link to="/home"></router-link>
    Vue.component('router-link', {
      props: {
        to: {
          type: String,
          required: true,
        },
      },
      methods: {
        clickHandler(e) {
          if (this.$router.$options.mode === 'history') {
            // history 通过pushState改变地址，阻止默认行为
            console.log('history模式')
            history.pushState({}, '', this.to)
            this.$router._data.currentUrl = this.to
            e.preventDefault && e.preventDefault()
          }
        }
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: '#' + this.to,
            },
            on: {
              click: this.clickHandler
            }
          },
          this.$slots.default
        )
      },
    })
    Vue.component('router-view', {
      render(h) {
        const { routesMap, _data } = this.$router
        const component = routesMap[_data.currentUrl]
        console.log('component==', component)
        return h(component)
      },
    })
  }
  constructor(options) {
    /* 
      1、保存配置选项
      2、获取路由映射，可以通过hash获取到对应组件
      3、设置响应式变量currentUrl，保存当前url
      4、监听hashchange事件，hash改变时，同时改变currentUrl
    */
    //  1、保存配置选项
    this.$options = options
    //  2、获取路由映射，可以通过hash获取到对应组件
    this.routesMap = {}
    this.$options.routes.forEach((route) => {
      this.routesMap[route.path] = route.component
    })
    console.log('routesMap===', this.routesMap)
    // 3、设置响应式变量currentUrl，保存当前url
    this._data = VueConstructor.observable({
      currentUrl: '/',
    })
    //  4、监听popstate或hashchange事件，hash改变时，同时改变currentUrl
    // 如果浏览器支持popstate，则监听popstate，不支持使用hashchange
    window.addEventListener('hashchange', () => {
      this._data.currentUrl = window.location.hash.slice(1)
      console.log('this.currentUrl==', this._data.currentUrl)
    })
  }
}
```
## 源码实现思路
+ 因为Vue.use方法会调用install静态方法，并传入Vue的构造函数，所以可以在install方法保存Vue构造函数，使VueRouter内部也可以使用到Vue
+ 通过VueRouter.installed判断插件是否已经安装过，安装过的就无需要再次执行install
+ 通过Vue.mixin混入的方式，在Vue实例化时，在beforeCreate生命周期里，给Vue原型挂载router对象Vue.prototype.$router = router，这里只需要挂载根实例，组件则不需要挂载，通过$options.router判断是否是根实例
+ 注册router-view、router-link全局组件
+ router-view,根据当前url在路由表中找到对应组件，进行渲染。并且当前url改变时，重新渲染。可以通过一响应式变量保存当前url。
+ router-link渲染为a标签，如果是history模式，点击时通过history.pushState改变浏览器记录，并阻止a标签默认行为，防止页面刷新
+ 在VueRouter构造函数中，保存路由配置，并通过传入的路由表生成路由映射
+ 通过变量currentUrl保存当前url，并将currentUrl设置为Vue的响应式变量，让Vue帮助做依赖收集，router-view则通过依赖currentUrl去获取相对应组件，这样currentUrl改变时route-view会重新渲染
+ 监听浏览器popstate事件，url改变时，currentUrl重新设值（hash模式如果浏览器不支持popstate，则监听hashchange）