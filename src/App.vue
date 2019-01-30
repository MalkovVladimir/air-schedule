<template>
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <air-schedule />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AirSchedule from './components/AirSchedule.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    AirSchedule
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
