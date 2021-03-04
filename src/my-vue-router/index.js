let VueConstructor = null
export default class MyVueRouter {
  static install(Vue) {
    /* 
     1、保存Vue构造函数
     2、在Vue实例挂载 $router实例
     3、注册全局组件<router-view></router-view> 和 <router-link>
    */
    // 1 保存Vue构造函数
    VueConstructor = Vue
    // 2、通过混入的方式，在Vue实例挂载 $router实例
    Vue.mixin({
      beforeCreate() {
        // 只有Vue实例 才需要挂载$router, 组件不需要执行
        if (this.$options.router) {
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
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: '#' + this.to,
            },
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
    console.log(this._data)
    //  4、监听hashchange事件，hash改变时，同时改变currentUrl
    window.addEventListener('hashchange', () => {
      this._data.currentUrl = window.location.hash.slice(1)
      console.log('this.currentUrl==', this._data.currentUrl)
    })
  }
}
