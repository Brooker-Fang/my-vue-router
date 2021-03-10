let Vue
class Store {
  static install(vue) {
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
  constructor(options) {
    this.$options = options
    Vue.util.defineReactive(this, 'state', this.$options.state)
  }
  commit = (type, payload) => {
    // 根据type 从 mutations里面找对应的方法
    const fn = this.$options.mutations[type]
    if (!fn) return
    fn.call(this, this.state, payload)
  }
  dispatch  = (type, payload) => {
    // 根据type 从 actions里面找对应的方法
    const fn = this.$options.actions[type]
    if (!fn) return
    fn.call(this, this.state, payload)
  }
}
function install() {

}
export default { Store, install }
