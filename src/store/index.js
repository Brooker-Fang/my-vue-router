import Vue from 'vue'
import Vuex from ''
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state, payload) {
      state.court += payload
    } 
  },
  actions: {
    
  },
})