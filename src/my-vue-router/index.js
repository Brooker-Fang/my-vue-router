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
    /* 设置成响应式变量另外两种实现方式：
       1、使用VueConstructor.util.definedReactive(this, 'current', '/')
       2、使用新的Vue实例保存data。
       this._data = new VueConstructor({
         data: {
           currentUrl: '/'
           $$currentUrl: '/' // 加上两个$, 不会被代理到Vue实例上
         }
       })
       然后通过this.$router._data.currentUrl访问
    */

    //  4、监听popstate或hashchange事件，hash改变时，同时改变currentUrl
    // 如果浏览器支持popstate，则监听popstate，不支持使用hashchange
    window.addEventListener('hashchange', () => {
      this._data.currentUrl = window.location.hash.slice(1)
      console.log('this.currentUrl==', this._data.currentUrl)
    })
  }
}
