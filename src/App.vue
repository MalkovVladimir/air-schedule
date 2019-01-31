<template>
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <air-schedule 
      v-if="isDataReady" 
      :flights="flights"
      :airports="airports"
    />
  </div>
</template>

<script>
/**
 * SVO - код аэропорта шереметьево
 */
import SVO_Schedule from './fakeData/SVO_Schedule.json'
import SVO_Statuses from './fakeData/SVO_Statuses.json'
import HelloWorld from './components/HelloWorld.vue'
import AirSchedule from './components/AirSchedule.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    AirSchedule
  },
  data() {
    return {
      flights: {},
      airports: {},
      isDataReady: false
    }
  },
  created: function() {
    this.parseRawData(this.getFakeSVOData())
  },
  methods: {
    getSVOData: function() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/json");

      fetch(
        "https://api.flightstats.com/flex/schedules/rest/v1/json/to/SVO/arriving/2019/1/31/9?appId=4e6e22ed&appKey=84e0e5775586e5b18c5de421ffe0fa3e",
        {
          method: "GET",
          headers: myHeaders,
          mode: "cors",
          cache: "default",
          qs: {
            appId: "4e6e22ed",
            appKey: "84e0e5775586e5b18c5de421ffe0fa3e",
            arrivalAirportCode: "SVO",
            year: new Date().getYear(),
            month: new Date().getMonth(),
            day: new Date().getDay(),
            hourOfDay: new Date().getHours()
          }
        }
      ).then(resp => {
        this.schedule = resp.json();
      });
    },
    getFakeSVOData: function() {
      return SVO_Schedule
    },
    parseRawData: function(data) {
      data.appendix.airports.forEach(airport => {
        const {fs, ...clean} = airport
        this.airports[airport.fs] = clean
      });
      this.flights = data.scheduledFlights
      this.isDataReady = true
    }
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