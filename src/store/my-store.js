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
    new Error(`use store.replaceState() to explicit replace store state.`)
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
