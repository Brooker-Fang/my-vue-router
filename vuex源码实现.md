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
this.$store.commit('add', 1)
this.$store.dispatch('')
```