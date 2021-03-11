import Vue from 'vue'
import Vuex from 'vuex'
// import Vuex from './my-store'
Vue.use(Vuex)

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