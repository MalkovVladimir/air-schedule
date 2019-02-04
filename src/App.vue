<template>
  <div id="app">
    <air-schedule
      v-if="isDataReady"
      :flights="flights"
      :airports="airports"
      @settingsUpdate="getAirportData"
    />
  </div>
</template>

<script>
/**
 * SVO - код аэропорта шереметьево
 */
import svoSchedule from './fakeData/SVO_Schedule.json'
import AirSchedule from './components/AirSchedule.vue'

export default {
  name: 'app',
  components: {
    AirSchedule
  },
  data () {
    return {
      flights: {},
      airports: {},
      isDataReady: false
    }
  },
  created: function () {
    this.getAirportData()
  },
  methods: {
    getAirportData: function (obj) {
      let currentDate = new Date()

      let settings = obj ? obj.settings : null
      let isArrive = obj ? obj.isArrive : true

      let params = settings || {
        arrivalAirportCode: 'SVO',
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
        hourOfDay: currentDate.getHours()
      }

      let query = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')

      query += '&' + encodeURIComponent('isArrive') +
        '=' + encodeURIComponent(isArrive) // анти-реактивный костыль, что поделать, не успеваю

      fetch('http://localhost:3000/url?' + query, {
        method: 'POST'
      }).then(resp => {
        resp.json().then(data => {
          data = JSON.parse(data)
          if (data.apiError) { this.parseRawData(this.getFakeSVOData()) } else { this.parseRawData(data) }
        })
      })
    },
    getFakeSVOData: function () {
      return svoSchedule
    },
    parseRawData: function (data) {
      console.log(data)
      if (data && !data.error) {
        data.appendix.airports.forEach(airport => {
          const { fs, ...clean } = airport
          this.airports[airport.fs] = clean
        })
        this.flights = data.flightStatuses
        this.isDataReady = true
      } else {
        alert(
          `Ошибка, перезагрузите страницу. ${
            data ? data.error.errorMessage : ''
          }`
        )
      }
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: #eee;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(0, 100%);
}
.slide-leave-to {
  transform: translate(0, -100%);
}
</style>
