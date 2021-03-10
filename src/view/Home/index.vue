<template>
 <div>
   Home
   <div @click="$store.commit('add', 1)">state.count:{{$store.state.count}}</div>
   <button @click="$store.dispatch('delayAdd', 5)">dispatch</button>
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
