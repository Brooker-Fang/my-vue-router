<template>
 <div>
   Home
   <div @click="$store.commit('add', 1)">state.count:{{$store.state.count}}</div>
   <div >getters.doubleCount:{{$store.getters.doubleCount}}</div>
   <button @click="$store.dispatch('delayAdd', 5)">dispatch</button>
   <button @click="$store.state = {count: 100}">直接修改state的值</button>
 </div>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
    }
  }
}
</script>
<style  scoped>
    
</style>
