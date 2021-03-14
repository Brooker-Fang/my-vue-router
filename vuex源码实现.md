## Vuex使用
### 1、注册Vuex插件
```js
import Vuex from 'vuex'
Vue.use(Vuex)
```
### 2、创建Store实例
```js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state, payload) {
      state.count += payload
    } 
  },
  actions: {
    delayAdd(context, payload) {
      setTimeout(() => {
        context.commit("add", payload)
      }, 1000)
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2
    }
  }
})
```
### 3、挂载到Vue根实例中
```js
new Vue({
  render: h => h(App),
  store
}).$mount('#app')
```
### 4、组件中使用
```js
this.$store.state.count
this.$store.getters.doubleCount
this.$store.commit('add', 1)
this.$store.dispatch('')
```

## 总结，Vuex需要做以下这些事
+ 实现install方法
+ 在Vue根实例化时，给Vue根实例挂载store对象
+ store.state和getter都是数据响应式，并且不能直接修改的state和getter的值，只能通过commit和dispatch
+ 实现commit，同步修改state的值
+ 实现dispatch，支持异步修改state的值
## 源码实现
```js
let Vue
class Store {
  constructor(options) {
    this._vm = null
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrappedGetters = options.getters
    this.getters = {}
    const storeComputed = {}
    const self_store = this
    Object.keys(this._wrappedGetters).forEach((key) => {
      // 遍历取出getters的每个方法
      const gettersFn = self_store._wrappedGetters[key]
      // 转换为computed， 即返回一个无参数的高阶函数
      storeComputed[key] = () => {
        return gettersFn(self_store.state)
      }
      // 定义getter为 只读属性,并且可枚举
      Object.defineProperty(self_store.getters, key, {
        get: () => self_store._vm[key],
        enumerable: true
      })
    })
    // new一个新的Vue实例_vm，并在_vm做数据响应式处理
    this._vm = new Vue({
      data: {
        $$state: options.state // 加$$表示不代理到Vue实例属性上
        // Vue初始化在对数据做响应式处理时，还会将数据代理到实例
      },
      computed: {
        ...storeComputed
      }
    })
    console.log(this._vm)
  }
  get state () {
    return this._vm._data.$$state
  }
  set state(v) {
    throw new Error(`use store.replaceState() to explicit replace store state.`)
  }
  // 这里需要使用箭头函数 防止this改变
  // 或者使用this.commit = this.commit.bind(this) 绑定this
  commit = (type, payload) => {
    // 根据type 从 mutations里面找对应的方法
    const fn = this._mutations[type]
    if (!fn) return
    fn.call(this, this.state, payload)
  }
  dispatch  = (type, payload) => {
    // 根据type 从 actions里面找对应的方法
    const fn = this._actions[type]
    if (!fn) return
    fn.call(this, {commit: this.commit, state: this.state}, payload)
  }
}
function install(vue) {
  /* 
     1、判断是否安装过插件
     2、保存vue构造函数
     3、通过混入的方式，在根实例创建时挂载store实例
    */
    //  1、判断是否安装过插件
    if (Store.installed) {
      return
    }
    Store.installed = true
    //2、保存vue构造函数
    Vue = vue
    //通过混入的方式，在根实例创建时挂载store实例
    Vue.mixin({
      beforeCreate() {
        if (this.$options.store) {
          Vue.prototype.$store = this.$options.store
        }
      },
    })
}
export default { Store, install }

```
## 源码实现思路

+ 执行install方法时，通过Vue.mixin混入的方式，在Vue实例化时，在beforeCreate生命周期里，给Vue原型挂载store对象Vue.prototype.$store = store
+ Store构造函数里保存传入的配置选项，便于获取state、mutations、actions、getters等
+ store.state实现：通过new一个新的Vue实例_vm, 把state存于_vm.data，state就变为响应式数据。重写state的set和get，防止直接修改state的值，只能通过commit和dispatch修改state的值，get则从_vm.data获取
+ commit方法实现：commit需要绑定this为store实例，防止dispatch调用是this指向改变。通过传入的参数type，从mutations里取出函数执行，并传入state参数
+ dispatch方法实现：与commit方法类似，通过传入的参数type，从actions里取出函数执行，并将commit方法和state存于context作为参数传入
+ getters实现：遍历getters的属性，都转换为_vm的computed里面，即返回无参的高阶函数，并使用Object.defineProperty为每个key重新定义get方法，无需定义set,防止直接修改getter的值

